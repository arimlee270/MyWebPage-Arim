var $event = $.event,
  $special,
  resizeTimeout;

$special = $event.special.debouncedresize = {
  setup: function () {
    $(this).on('resize', $special.handler);
  },
  teardown: function () {
    $(this).off('resize', $special.handler);
  },
  handler: function (event, execAsap) {
    var context = this,
      args = arguments,
      dispatch = function () {
        event.type = 'debouncedresize';
        $event.dispatch.apply(context, args);
      };

    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }

    execAsap
      ? dispatch()
      : (resizeTimeout = setTimeout(dispatch, $special.threshold));
  },
  threshold: 250
};

var BLANK =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

$.fn.imagesLoaded = function (callback) {
  var $this = this,
    deferred = typeof $.Deferred === 'function' ? $.Deferred() : 0,
    hasNotify = typeof deferred.notify === 'function',
    $images = $this.find('img').add($this.filter('img')),
    loaded = [],
    proper = [],
    broken = [];

  if ($.isPlainObject(callback)) {
    $.each(callback, function (key, value) {
      if (key === 'callback') {
        callback = value;
      } else if (deferred) {
        deferred[key](value);
      }
    });
  }

  function doneLoading() {
    var $proper = $(proper),
      $broken = $(broken);

    if (deferred) {
      if (broken.length) {
        deferred.reject($images, $proper, $broken);
      } else {
        deferred.resolve($images);
      }
    }

    if (typeof callback === 'function') {
      callback.call($this, $images, $proper, $broken);
    }
  }

  function imgLoaded(img, isBroken) {
    if (img.src === BLANK || $.inArray(img, loaded) !== -1) {
      return;
    }

    loaded.push(img);

    if (isBroken) {
      broken.push(img);
    } else {
      proper.push(img);
    }

    $.data(img, 'imagesLoaded', { isBroken: isBroken, src: img.src });

    if (hasNotify) {
      deferred.notifyWith($(img), [isBroken, $images, $(proper), $(broken)]);
    }

    if ($images.length === loaded.length) {
      setTimeout(doneLoading);
      $images.off('.imagesLoaded');
    }
  }

  if (!$images.length) {
    doneLoading();
  } else {
    $images
      .on('load.imagesLoaded error.imagesLoaded', function (event) {
        imgLoaded(event.target, event.type === 'error');
      })
      .each(function (i, el) {
        var src = el.src;

        var cached = $.data(el, 'imagesLoaded');
        if (cached && cached.src === src) {
          imgLoaded(el, cached.isBroken);
          return;
        }

        if (el.complete && el.naturalWidth !== undefined) {
          imgLoaded(el, el.naturalWidth === 0 || el.naturalHeight === 0);
          return;
        }

        if (el.readyState || el.complete) {
          el.src = BLANK;
          el.src = src;
        }
      });
  }

  return deferred ? deferred.promise($this) : $this;
};

var Grid = (function () {
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var $grid = $('*#og-grid'),
    $items = $grid.children('li'),
    current = -1,
    previewPos = -1,
    scrollExtra = 0,
    marginExpanded = 10,
    $window = $(window),
    winsize,
    $body = $('html, body'),
    transEndEventNames = {
      WebkitTransition: 'webkitTransitionEnd',
      MozTransition: 'transitionend',
      OTransition: 'oTransitionEnd',
      msTransition: 'MSTransitionEnd',
      transition: 'transitionend'
    },
    transEndEventName = transEndEventNames[Modernizr.prefixed('transition')],
    support = Modernizr.csstransitions,
    settings = {
      minHeight: 500,
      speed: 350,
      easing: 'ease'
    };

  function init(config) {
    settings = $.extend(true, {}, settings, config);
    // Fixed image dimensions keep card positions stable; bind interactions
    // immediately so offscreen lazy-loaded cards do not delay the grid.
    saveItemInfo(true);
    getWinSize();
    initEvents();
  }

  function addItems($newitems) {
    $items = $items.add($newitems);

    $newitems.each(function () {
      var $item = $(this);
      $item.data({
        offsetTop: $item.offset().top,
        height: $item.height()
      });
    });

    initItemsEvents($newitems);
  }

  function saveItemInfo(saveheight) {
    $items.each(function () {
      var $item = $(this);
      $item.data('offsetTop', $item.offset().top);
      if (saveheight) {
        $item.data('height', $item.height());
      }
    });
  }

  function initEvents() {
    initItemsEvents($items);

    $('#portfolio-preview').on('click', 'button.og-close', function () {
      hidePreview(true);
      return false;
    });

    $window.on('keydown', function (event) {
      if (event.key === 'Escape' && $.data(this, 'preview')) {
        hidePreview(true);
      }
    });

    $window.on('debouncedresize', function () {
      scrollExtra = 0;
      previewPos = -1;
      saveItemInfo();
      getWinSize();
      var preview = $.data(this, 'preview');
      if (typeof preview != 'undefined') {
        hidePreview();
      }
    });
  }

  function initItemsEvents($items) {
    $items
      .children('a')
      .on('keydown', function (event) {
        if (event.key === 'Enter') {
          event.preventDefault();
          $(this).trigger('click');
        }
      })
      .on('click', function (e) {
        var $item = $(this).parent();
        current === Array.from($items).findIndex((d) => d == $item[0])
          ? hidePreview()
          : showPreview($item);
        return false;
      });
  }

  function getWinSize() {
    winsize = { width: $window.width(), height: $window.height() };
  }

  function showPreview($item) {
    var preview = $.data(this, 'preview'),
      position = $item.data('offsetTop');

    scrollExtra = 0;

    if (typeof preview != 'undefined') {
      if (previewPos !== position) {
        if (position > previewPos) {
          scrollExtra = preview.height;
        }
        hidePreview();
      } else {
        preview.update($item);
        return false;
      }
    }

    previewPos = position;
    preview = $.data(this, 'preview', new Preview($item));
    preview.open();
  }

  function hidePreview(restoreFocus) {
    current = -1;
    var preview = $.data(this, 'preview');
    var $focusTarget = preview.$item.children('a');
    preview.close();
    $.removeData(this, 'preview');

    if (restoreFocus) {
      window.setTimeout(function () {
        $focusTarget.trigger('focus');
      }, settings.speed + 50);
    }
  }

  function Preview($item) {
    this.$item = $item;
    this.expandedIdx = Array.from($items).findIndex((d) => d == this.$item[0]);
    this.create();
    this.update();
  }

  Preview.prototype = {
    create: function () {
      this.$title = $('<h3></h3>');
      this.$description = $('<div class="portfolio-description"></div>');
      this.$github = $(
        '<a href="#" class="button" target="_blank" rel="noreferrer">GITHUB</a>'
      );
      this.$demo = $(
        '<a href="#" class="button" target="_blank" rel="noreferrer">LIVE DEMO</a>'
      );
      this.$actions = $('<div class="og-actions"></div>').append(
        this.$github,
        this.$demo
      );
      this.$details = $('<div class="og-details"></div>').append(
        this.$title,
        this.$description,
        this.$actions
      );
      this.$loading = $('<div class="og-loading"></div>');
      this.$fullimage = $('<div class="og-fullimg"></div>').append(
        this.$loading
      );
      this.$closePreview = $(
        '<button type="button" class="og-close" aria-label="상세 닫기"></button>'
      );
      this.$previewInner = $('<div class="og-expander-inner"></div>').append(
        this.$closePreview,
        this.$details
      );
      this.$previewEl = $('<div class="og-expander"></div>').append(
        this.$previewInner
      );
      $('#portfolio-preview').append(this.getEl());
      if (support) {
        this.setTransition();
      }
    },
    update: function ($item) {
      if ($item) {
        this.$item = $item;
      }

      if (current !== -1) {
        var $currentItem = $items.eq(current);
        $currentItem.removeClass('og-expanded');
        this.$item.addClass('og-expanded');
        this.positionPreview();
      }

      current = this.$item.index();

      var $itemEl = this.$item.children('a'),
        eldata = {
          href: $itemEl.attr('href'),
          largesrc: $itemEl.data('largesrc'),
          title: $itemEl.data('title'),
          description: this.$item.children('.hidden').html(),
          github: $itemEl.data('github'),
          demo: $itemEl.data('demo')
        };

      this.$title.html(eldata.title);
      this.$description.html(eldata.description);
      this.$description.toggleClass(
        'railab-description',
        eldata.title === 'RAI LAB'
      );
      this.setLink(this.$github, eldata.github);
      this.setLink(this.$demo, eldata.demo);
      this.$actions.toggle(Boolean(eldata.github || eldata.demo));

      var self = this;

      if (typeof self.$largeImg != 'undefined') {
        self.$largeImg.remove();
      }

      if (self.$fullimage.is(':visible')) {
        this.$loading.show();
        $('<img/>')
          .on('load', function () {
            var $img = $(this);
            if (
              $img.attr('src') === self.$item.children('a').data('largesrc')
            ) {
              self.$loading.hide();
              self.$fullimage.find('img').remove();
              self.$largeImg = $img.fadeIn(
                reducedMotion.matches ? 0 : 350
              );
              self.$fullimage.append(self.$largeImg);
            }
          })
          .attr('src', eldata.largesrc);
      }
    },
    setLink: function ($link, url) {
      if (url) {
        $link.attr('href', url).show();
      } else {
        $link.hide();
      }
    },
    open: function () {
      setTimeout(
        $.proxy(function () {
          this.setHeights();
          this.positionPreview();
        }, this),
        reducedMotion.matches ? 0 : 25
      );
    },
    close: function () {
      var self = this,
        skipMotion = reducedMotion.matches,
        onEndFn = function () {
          if (support) {
            self.$previewEl.off(transEndEventName);
          }
          self.$item.removeClass('og-expanded');
          self.$previewEl.remove();
        };

      setTimeout(
        $.proxy(function () {
          if (typeof this.$largeImg !== 'undefined') {
            this.$largeImg.fadeOut(skipMotion ? 0 : 'fast');
          }
          if (skipMotion) {
            onEndFn.call();
            return;
          }
          this.$previewEl.css('height', 0);
          this.$previewEl.on(transEndEventName, onEndFn);

          if (!support) {
            onEndFn.call();
          }
        }, this),
        skipMotion ? 0 : 25
      );

      return false;
    },
    calcHeight: function () {
      this.height = Math.max(settings.minHeight, winsize.height - marginExpanded);
    },
    setHeights: function () {
      this.calcHeight();
      this.$previewEl.css('height', this.height);
      this.$item.addClass('og-expanded');
    },
    positionPreview: function () {
      var previewOffsetT = this.$previewEl.offset().top - scrollExtra;
      $body
        .stop()
        .animate(
          { scrollTop: previewOffsetT - 55 },
          reducedMotion.matches ? 0 : settings.speed
        );
    },
    setTransition: function () {
      var transition = reducedMotion.matches
        ? 'none'
        : 'height ' + settings.speed + 'ms ' + settings.easing;
      this.$previewEl.css('transition', transition);
      this.$item.css('transition', transition);
    },
    getEl: function () {
      return this.$previewEl;
    }
  };

  return {
    init: init,
    addItems: addItems
  };
})();
$(function () {
  var $themeToggle = $('#theme-toggle');
  var savedTheme = null;
  try {
    savedTheme = window.localStorage.getItem('portfolio-theme');
  } catch (error) {
    // The toggle still works for this page if browser storage is unavailable.
  }
  var applyTheme = function (theme) {
    var isDark = theme === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    $themeToggle.attr('aria-pressed', String(isDark));
    $themeToggle.attr(
      'aria-label',
      isDark ? '밝은 모드로 전환' : '다크 모드로 전환'
    );
    $themeToggle.attr(
      'title',
      isDark ? '밝은 모드로 전환' : '다크 모드로 전환'
    );
  };

  applyTheme(savedTheme === 'dark' ? 'dark' : 'light');
  $themeToggle.on('click', function () {
    var nextTheme =
      document.documentElement.getAttribute('data-theme') === 'dark'
        ? 'light'
        : 'dark';
    try {
      window.localStorage.setItem('portfolio-theme', nextTheme);
    } catch (error) {
      // Keep the selected theme for this page if browser storage is unavailable.
    }
    applyTheme(nextTheme);
  });

  var $portfolioCarousel = $('.portfolio-carousel');
  var resetPortfolioCarousel = function () {
    $portfolioCarousel.scrollLeft(0);
  };

  resetPortfolioCarousel();
  $(window).on('pageshow.portfolioCarousel', resetPortfolioCarousel);
  $('#desktop-menu a[href="#portfolio"], .mobile-menu-list a[href="#portfolio"]')
    .on('click', resetPortfolioCarousel);

  var applyPortfolioFilter = function (filter, $button) {
    $('.portfolio-filter').removeClass('is-active').attr('aria-pressed', 'false');
    $button.addClass('is-active').attr('aria-pressed', 'true');

    $('#og-grid > li').each(function () {
      var $item = $(this);
      var categories = ($item.attr('data-categories') || '').split(/\s+/);
      var visible = filter === 'all' || categories.includes(filter);
      $item.toggleClass('portfolio-filter-hidden', !visible);
    });

    resetPortfolioCarousel();
    $('#og-grid > li:not(.portfolio-filter-hidden)').each(function () {
      var $item = $(this);
      $item.data({ offsetTop: $item.offset().top, height: $item.height() });
    });
  };

  $('.portfolio-filter').on('click', function () {
    var $button = $(this);
    var filter = $button.data('filter');
    var $openPreview = $('#portfolio-preview .og-expander');

    if ($openPreview.length) {
      $('#portfolio-preview .og-close').trigger('click');
      window.setTimeout(function () {
        applyPortfolioFilter(filter, $button);
      }, 400);
      return;
    }

    applyPortfolioFilter(filter, $button);
  });

  Grid.init();
});

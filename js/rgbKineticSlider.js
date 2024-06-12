(function() {
    window.rgbKineticSlider = function(options) {
        let imgWidth = 1920;
        let imgHeight = 1080;
        PIXI.utils.skipHello();

        const renderer = new PIXI.autoDetectRenderer(imgWidth,imgHeight, {
            transparent: true,
            autoResize: true,
            resolution: devicePixelRatio,
        }); 
        const canvas = document.getElementById("rgbKineticSlider");
        const stage = new PIXI.Container();
        const mainContainer = new PIXI.Container();
        const imagesContainer = new PIXI.Container();
        const textsContainer = new PIXI.Container();
        const textsSubContainer = new PIXI.Container();
        const dispSprite = new PIXI.Sprite.from(options.backgroundDisplacementSprite );
        const dispFilter = new PIXI.filters.DisplacementFilter(dispSprite);
        const dispSprite_2 = PIXI.Sprite.from(options.cursorDisplacementSprite);
        const dispFilter_2 = new PIXI.filters.DisplacementFilter(dispSprite_2);
        const splitRgb = new PIXI.filters.RGBSplitFilter;

        let render; 
        let slideImages;
        let slideTexts;
        let slideTextsSub;
        let currentIndex = 0;
        let is_swipping = false;
        let is_playing = false;
        let is_moving = false;
        let is_loaded = false;

        let posx = 0,
            posy = 0,
            vx = 0,
            vy = 0,
            kineX = 0,
            kineY = 0;

        (function() {
            let wf = document.createElement('script');
            wf.src = (document.location.protocol === 'https:' ? 'https' : 'http') +
                '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
            wf.type = 'text/javascript';
            wf.async = 'true';
            let s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(wf, s);
        }());

        function build_scene() {
            canvas.appendChild(renderer.view);

            stage.filters = [dispFilter];
            mainContainer.interactive = true;
            if(options.textsRgbEffect == true) {

                textsContainer.filters = [splitRgb];
                textsSubContainer.filters = [splitRgb];
                splitRgb.red = [0, 0];
                splitRgb.green = [0, 0];
                splitRgb.blue = [0, 0];
            }
            if(options.cursorTextEffect == true) {
                textsContainer.filters = [dispFilter_2, splitRgb];
                textsSubContainer.filters = [dispFilter_2, splitRgb];
            }
            else {
                if(options.cursorImgEffect  == true) {
                    imagesContainer.filters = [dispFilter_2];
                }
            }
            renderer.view.style.objectFit = 'cover';
            renderer.view.style.width = '100%';
            renderer.view.style.height = '100%';
            renderer.view.style.top = '50%';
            renderer.view.style.left = '50%';
            renderer.view.style.webkitTransform = 'translate( -50%, -50% ) scale(1.15)';
            renderer.view.style.transform = 'translate( -50%, -50% ) scale(1.15)';
            mainContainer.addChild(imagesContainer, textsContainer, textsSubContainer, dispSprite_2);
            stage.addChild(mainContainer, dispSprite);
            render = new PIXI.Ticker();
            render.autoStart = true;
            render.add(function(delta) {
                renderer.render(stage);
            });
        }
        function build_imgs() {

            for (let i = 0; i < options.slideImages.length; i++) {
                
                texture = new PIXI.Texture.from(options.slideImages[i]);

                imgSprite = new PIXI.Sprite(texture);
                imgSprite.anchor.set(0.5);
                imgSprite.x = renderer.width / 2;
                imgSprite.y = renderer.height / 2;

                TweenMax.set(imgSprite, {
                    alpha: 0
                });

                imagesContainer.addChild(imgSprite);
            }
            slideImages = imagesContainer.children;
        }
        let titleSize;
        let subtitleSize;
        let subtitleOffsetTop;

        function build_texts() {
            if(options.itemsTitles.length > 0) {
                if( options.textsDisplay == true) {
                    if(window.innerWidth < 768) {
                        titleSize = options.mobileTextTitleSize ;
                    }
                    else {
                        titleSize = options.textTitleSize ;
                        subtitleSize = options.textSubTitleSize;
                        subtitleOffsetTop = options.textSubTitleOffsetTop; 
                    }
                    for (let i = 0; i < options.itemsTitles.length; i++) {
                        let font_1 = options.googleFonts[0].split(':')[0];
                        let word_wrap;

                        if(window.innerWidth < 768) {
                            word_wrap = window.innerWidth * 1.5;
                        }
                        else {
                            word_wrap = window.innerWidth / 2
                        }
                        let fontWeight_1 = options.googleFonts[0].split(":").pop();
                        textTitles = new PIXI.Text(options.itemsTitles[i][0], {
                            fontFamily: font_1,
                            fontSize: titleSize,
                            fontWeight: fontWeight_1,
                            fill:  options.textTitleColor,
                            align: 'left',
                            padding : 0, 
                            wordWrap: true, 
                            wordWrapWidth: word_wrap, 

                        });
                        textTitles.anchor.set(0.5);
                        textTitles.x = renderer.width / 2;
                        textTitles.y = renderer.height / 2;

                        textsContainer.addChild(textTitles);
                        TweenMax.set(textTitles, {
                            alpha: 0
                        });

                    }
                    slideTexts = textsContainer.children;
                    if( options.textsSubTitleDisplay == true) {
                        for (let i = 0; i < options.itemsTitles.length; i++) {
                       
                            let font_2 = options.googleFonts[1].split(':')[0];
                        
                            let fontWeight_2 = options.googleFonts[1].split(":").pop();
                            let word_wrap;

                            if(window.innerWidth < 768) {
                                word_wrap = renderer.width / 1.5
                            }

                            else {
                                word_wrap = renderer.width / 2
                            }
                            
                            textTitles2 = new PIXI.Text(options.itemsTitles[i][1], {
                                fontFamily: font_2,
                                fontSize: subtitleSize,
                                fontWeight: fontWeight_2,
                                fill: options.textSubTitleColor,
                                align: 'left',
                                wordWrap: true,
                                wordWrapWidth: word_wrap,
                            });
                            textTitles2.anchor.set(0.5);
                            textTitles2.x = textTitles.x;
                             textTitles2.y = textTitles.y + subtitleOffsetTop;
                            textsSubContainer.addChild(textTitles2);
                            

                            TweenMax.set(textTitles2, {
                                alpha: 0
                            });
                        }
                        slideTextsSub = textsSubContainer.children;
                    }
                }
            }  
        }
        function slideTransition(next) {
            dispSprite.anchor.set(0.5);
            dispSprite.x = renderer.view.width / 2;
            dispSprite.y = renderer.view.height / 2;
            timelineTransition = new TimelineMax({
                onStart: function() {
                    is_playing = true;

                    is_swipping =                    false;

                    dispSprite.rotation = 0;
                },
                onComplete: function() {
                    is_playing = false;
                    is_swipping = false;

                    is_loaded = true
                    currentIndex = next;
                },

            });
            timelineTransition.clear();
            if (timelineTransition.isActive() ) {
                return;
            }
            var scaleAmp;
            if( is_loaded === false) {
                scaleAmp = 0;
            }else {
                scaleAmp = options.transitionScaleAmplitude;
            }if( (options.textsSubTitleDisplay  == true) && (options.textsDisplay == true) && (options.itemsTitles.length > 0) ) {

                timelineTransition
                    .to(dispFilter.scale, options.slideTransitionDuration, {
                        x: scaleAmp,
                        y: scaleAmp,
                        ease: Power2.easeIn
                    })
                    .to([slideImages[currentIndex], slideTexts[currentIndex], slideTextsSub[currentIndex]], options.slideTransitionDuration, {
                            alpha: 0,
                            ease: Power2.easeOut
                        }, options.slideTransitionDuration * 0.5)
                    .to([slideImages[next], slideTexts[next], slideTextsSub[next]], options.slideTransitionDuration, {
                            alpha: 1,
                            ease: Power2.easeOut
                        }, options.slideTransitionDuration * 0.5)
                    .to(dispFilter.scale, options.slideTransitionDuration, {
                        x: 0,
                        y: 0,
                        ease: Power1.easeOut
                    }, options.slideTransitionDuration);
            }
        };
        function cursorInteractive() {
            window.addEventListener("mousemove", onPointerMove);
            window.addEventListener("touchmove", onTouchMove);

            function onPointerMove(e) {
                posx = e.clientX;
                posy = e.clientY;
            }
            function onTouchMove(e) {
                posx = e.touches[0].clientX;
                posy = e.touches[0].clientY;
            }
            mainLoop();
        }
        function mainLoop() {
            mainLoopID = requestAnimationFrame(mainLoop);

             if(posy <= 0 || posx <= 0 || (posx >=  (window.innerWidth - 2 ) || posy >= (window.innerHeight - 2 ))) {

                is_moving = false;

                posx = vx = window.innerWidth / 2;
                posy = vy = window.innerHeight / 2;             
                kineX = kineY = newkineX = newkineY = 0;
            }
            else {
                 is_moving = true;
            }
            vx += ((posx - vx) * options.cursorMomentum);
            vy += ((posy - vy) * options.cursorMomentum);
 
            kineX = Math.floor(posx - vx);
            kineY = Math.floor(posy - vy);
            if( is_moving === true ) {
   
                dispSprite_2.x = vx;
                dispSprite_2.y = vy ;

                TweenMax.to(dispFilter_2.scale, 0.5, {
                        x: kineX * options.cursorScaleIntensity,
                        y: kineY *  options.cursorScaleIntensity,
                        ease: Power4.easeOut
                });
            }if ((is_playing)) {
                dispSprite.x = vx;
                dispSprite.y = vy;
            }if (is_swipping) {
                dispSprite.x = vx;
                dispSprite.y = vy;
                dispFilter.x = vx;
                dispFilter.y = vy;
            }
        }

        let nav = document.querySelectorAll('.main-nav');
        for (let i = 0; i < nav.length; i++) {

            let navItem = nav[i];

            navItem.onclick = function(event) {

                if (is_playing) {
                    return false;
                }
                const active = document.querySelector('.active');

                if(active){
                    active.classList.remove('active');
                }
                  this.classList.add('active');

                if (this.getAttribute('data-nav') === 'next') {
                    if (currentIndex >= 0 && currentIndex < options.slideImages.length - 1) {
                        slideTransition(currentIndex + 1);
                    } else {
                        slideTransition(0);
                    }
                } else {
                    if (currentIndex > 0 && currentIndex < options.slideImages.length) {
                        slideTransition(currentIndex - 1);
                    } else {
                        slideTransition(options.slideImages.length - 1);
                    }
                }
                return false;
            }
        }
        function init() {
            renderer.resize(imgWidth,imgHeight);
            build_scene();
            build_imgs();
            resizeTexts();
            cursorInteractive();
            slideTransition(currentIndex);
            window.addEventListener('resize', resizeTexts);
            function resizeTexts() {
          
                if(window.innerWidth < 768) {
                    build_texts();
                    renderer.render(stage);
                }
                else {
                    build_texts();
                    renderer.render(stage);
                }   
            }
        };
        window.WebFontConfig = {
            google: {
                families: options.googleFonts
            },

            active: function() { 

                imagesLoaded(images, function() {
                    document.body.classList.remove('loading');

                    init();
                });
            }
        };
    };
})();


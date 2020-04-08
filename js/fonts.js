var html = document.documentElement;

var fontsfile = document.createElement('link');
fontsfile.href = pathTemplate + 'css/fonts.css';
fontsfile.rel = 'stylesheet';
document.head.appendChild(fontsfile);

if (sessionStorage.fontsLoaded) {
    html.classList.add('fonts-loaded');
} else {
    var script = document.createElement('script');
    script.src = pathTemplate + 'js/fontfaceobserver.js';
    script.async = true;

    script.onload = function () {
        var Lato300 = new FontFaceObserver('Lato', {
            weight: '300'
        });
        var Lato400 = new FontFaceObserver('Lato', {
            weight: 'normal'
        });
        var Lato500 = new FontFaceObserver('Lato', {
            weight: '500'
        });
        var Lato600 = new FontFaceObserver('Lato', {
            weight: '600'
        });
        var Lato800 = new FontFaceObserver('Lato', {
            weight: '800'
        });
        var Roboto400 = new FontFaceObserver('Roboto', {
            weight: 'normal'
        });

        Promise.all([
            Lato300.load(),
            Lato400.load(),
            Lato500.load(),
            Lato600.load(),
            Lato800.load(),
            Roboto400.load()
        ]).then(function () {
            html.classList.add('fonts-loaded');
            sessionStorage.fontsLoaded = true;
        });
    };
    document.head.appendChild(script);
}
function loadScripts() {
    var directory = 'imgs/all/';
    var extension = '.png';
    var files = ['model', 'view', 'controller'];
    for (var file of files) {
        var path = directory + file + extension;
        var script = document.createElement("script");
        script.src = path;
        document.body.appendChild(script);
    }
}

let knight_red = document.getElementById("knight_red");
let knight_red_hit = document.getElementById("knight_red_hit");
let knight_red_flipped = document.getElementById("knight_red_flipped");
let knight_red_flipped_hit = document.getElementById("knight_red_flipped_hit");
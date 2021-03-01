// déclaration des variables
const red = '#ff0000';
const blue = '#0000ff';
const yellow = '#ffff00';

const canvas = document.getElementById('canvas'); // récupération de la zone où dessiner mon canvas
const c = canvas.getContext('2d'); // dessin du canvas en 2D
const run = document.querySelector('button'); // bouton pour commencer le jeu
const displayScore = document.getElementById('score'); // score du joueur
const displayTime = document.getElementById('time'); // temps pour jouer
const text = document.getElementById('text'); // texte d'information pour le joueur

const projectiles = []; // tableau pour les projectiles
const cibles = []; // tableau pour les cibles

// canon, lanceur
let canon = {
    x: canvas.width / 2, // initialise le canon au centre en horizontal
    y: canvas.height - 80, // initialise le canon à 80 au dessus de la ligne basse en vertical
    dx: 10,
    dy: 10
}

// dessiner le canon
function drawCanon() {
    c.beginPath(); // beginPath() crée un nouveau trajet. Une fois créé, les fonctions de dessin ultérieures seront dirigées vers le trajet et utilisées pour le construire.
    c.moveTo(canon.x, canon.y); // dessin d'un triangle de 60 de haut et 60 de large
    c.lineTo(canon.x + 30, canon.y + 60); // dessin d'un triangle de 60 de haut et 60 de large
    c.lineTo(canon.x - 30, canon.y + 60); // dessin d'un triangle de 60 de haut et 60 de large
    c.closePath(); // closePath() ferme le trajet pour que les fonctions de dessin ultérieures soient à nouveau dirigées vers le contexte.
    c.fillStyle = blue; // fillStyle = color définit le style utilisé lors du remplissage de formes.
    c.fill(); // fill() dessine une forme pleine en remplissant la zone de contenu du trajet.
}

// projectiles
class Projectile {
    // constructeur
    constructor(x, y, radius, color, velocity) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.color = color;
            this.velocity = velocity;
        }
        // dessiner le projectile
    draw() {
            c.beginPath(); // beginPath() crée un nouveau trajet. Une fois créé, les fonctions de dessin ultérieures seront dirigées vers le trajet et utilisées pour le construire.
            c.arc(this.x, this.y, this.radius, 0, Math.PI * 2); // cercle
            c.fillStyle = this.color; // fillStyle = color définit le style utilisé lors du remplissage de formes.
            c.fill(); // fill() dessine une forme pleine en remplissant la zone de contenu du trajet.
        }
        // mettre à jour le projectile en coordonnées et vitesse
    update() {
        this.draw(); // redessine
        this.y = this.y - this.velocity;
    }
}

// random nombre aléatoire, max inclus, sera utilisé pour les coordonnées de la cible
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// cible
class Cible {
    // constructeur
    constructor(y) {
            this.x = randInt(20, canvas.width - 20);
            this.y = y;
            this.radius = randInt(20, 40);
            this.color = red;
        }
        // dessiner la cible
    draw() {
        c.beginPath(); // beginPath() crée un nouveau trajet. Une fois créé, les fonctions de dessin ultérieures seront dirigées vers le trajet et utilisées pour le construire.
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2); // cercle
        c.fillStyle = this.color; // fillStyle = color définit le style utilisé lors du remplissage de formes.
        c.fill(); // fill() dessine une forme pleine en remplissant la zone de contenu du trajet.
    }
}

// 1ere cible dans le tableau, le jeu commence
cibles.push(new Cible(100));

// variables de score et de jeu
let score = 0
let playing = false

// EventListener qui lance le jeu
run.addEventListener('click', () => {
    run.setAttribute('disabled', true); // retire le bouton
    timer = 30; // déploie un timer de 30 secondes
    canvas.style.display = 'block'; // initialise le canvas comme un bloc
    playing = true; // possibilité de jouer
    setInterval(() => {
            timer-- // affiche le temps restant et le décrémente
        }, 1000) // 1 seconde à la fois (1000 ms = 1 s)
    loop(); // fait la boucle et relance la même chose
})

// fin du jeu
function endOfGame() {
    playing = false; // plus la possibilité de jouer
    displayTime.innerHTML = '0'; // plus de temps disponible
    canvas.style.display = 'none'; // le bloc jeu n'est plus affiché
    text.innerHTML = `Done ! You destroyed ${score} targets in 30 seconds <br> Please refresh to play more.`;
    run.style.display = 'none'; // plus de bouton, il faut rafaîchir la page
}

// boucle principale du jeu
function loop() {
    if (timer === 0) { // si plus de temps
        endOfGame(); // fin du jeu
    }
    if (playing) { // si on peut jouer
        displayTime.innerHTML = timer; // indiquer le temps restant
        c.clearRect(0, 0, canvas.width, canvas.height) // efface un rectangle dans un rectangle donné pour pouvoir jouer
        drawCanon(); // dessiner le canon

        projectiles.forEach((proj) => { // pour chaque projectile tiré par l'utilisateur
            proj.update(); // actualise le nouveau projectile

            if (proj.x >= cibles[0].x - cibles[0].radius && proj.x <= cibles[0].x + cibles[0].radius && proj.y < 100 + cibles[0].radius && proj.y > 100) {
                // si le projectile a atteint sa cible
                cibles.pop(); // effacer la cible
                cibles.push(new Cible(100)); // remettre une nouvelle cible
                score++; // incrémenter le score
                displayScore.innerHTML = score; // afficher le nouveau score
            }
        })

        cibles.forEach((targ) => { // pour chaque cible à atteindre
                targ.draw(); // l'afficher
            })
            // notifie le navigateur que vous souhaitez exécuter une animation et demande que celui-ci exécute une fonction
            // spécifique de mise à jour de l'animation, avant le prochain rafraîchissement du navigateur. Cette méthode
            // prend comme argument un callback qui sera appelé avant le rafraîchissement du navigateur.
        requestAnimationFrame(loop);
    }
}

// EventListener pour le clavier (touches pressées)
document.addEventListener('keydown', (element) => {
    if (element.key === 'ArrowLeft') { // si la touche flèche de gauche est pressée
        canon.x -= canon.dx; // déplacer le canon vers la gauche
        if (canon.x < 30) { // si le canon est au bord gauche du canvas, on le laisse comme ca, il ne peut pas aller plus loin
            canon.x = 30;
        }
    } else if (element.key === 'ArrowRight') { // si la touche flèche de droite est pressée
        canon.x += canon.dx; // déplacer le canon vers la droite
        if (canon.x > canvas.width - 30) { // si le canon est au bord droit du canves, on le laisse comme ca, il ne peut pas aller plus loin
            canon.x = canvas.width - 30;
        }
    } else if (element.key === ' ') { // si la touche espace est pressée
        projectiles.push(new Projectile(canon.x, canon.y, 5, yellow, 8)) // lancer un projectile et le faire se déplacer
    }

})
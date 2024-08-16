// airplane-shooting.js
window.initGame = (React, assetsUrl) => {
  const { useState, useEffect, useRef } = React;

  const AirplaneShooting = ({ assetsUrl }) => {
    const canvasRef = useRef(null);
    const [score, setScore] = useState(0);
    const [airplane, setAirplane] = useState({
      x: 100,
      y: 400,
      width: 50,
      height: 30,
      velocityX: 0,
    });
    const [bullets, setBullets] = useState([]);
    const [enemies, setEnemies] = useState([]);
    const [airplaneImage, setAirplaneImage] = useState(null);
    const [bulletImage, setBulletImage] = useState(null);
    const [enemyImage, setEnemyImage] = useState(null);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      // Load images
      const airplaneImg = new Image();
      airplaneImg.src = `${assetsUrl}/airplane.png`;
      airplaneImg.onload = () => setAirplaneImage(airplaneImg);

      const bulletImg = new Image();
      bulletImg.src = `${assetsUrl}/bullet.png`;
      bulletImg.onload = () => setBulletImage(bulletImg);

      const enemyImg = new Image();
      enemyImg.src = `${assetsUrl}/enemy.png`;
      enemyImg.onload = () => setEnemyImage(enemyImg);

      // Game loop
      const gameLoop = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update airplane position
        airplane.x += airplane.velocityX;
        if (airplane.x < 0) {
          airplane.x = 0;
        } else if (airplane.x > canvas.width - airplane.width) {
          airplane.x = canvas.width - airplane.width;
        }

        // Update bullets
        setBullets(bullets.map((bullet) => {
          bullet.y -= 5;
          return bullet;
        }));

        // Remove bullets that go off-screen
        setBullets(bullets.filter((bullet) => bullet.y > 0));

        // Update enemies
        setEnemies(enemies.map((enemy) => {
          enemy.x -= 2;
          if (enemy.x < 0) {
            enemy.x = canvas.width;
          }
          return enemy;
        }));

        // Check for bullet-enemy collisions
        const newEnemies = enemies.filter((enemy) => {
          const isHit = bullets.some((bullet) => {
            if (
              bullet.x > enemy.x &&
              bullet.x < enemy.x + enemy.width &&
              bullet.y > enemy.y &&
              bullet.y < enemy.y + enemy.height
            ) {
              setScore(score + 10);
              return true;
            }
            return false;
          });
          return !isHit;
        });
        setEnemies(newEnemies);

        // Check for enemy-airplane collisions
        if (enemies.some((enemy) => {
          return (
            airplane.x < enemy.x + enemy.width &&
            airplane.x + airplane.width > enemy.x &&
            airplane.y < enemy.y + enemy.height &&
            airplane.y + airplane.height > enemy.y
          );
        })) {
          setGameOver(true);
        }

        // Spawn enemies randomly
        if (Math.random() < 0.01) {
          setEnemies([
            ...enemies,
            {
              x: canvas.width,
              y: Math.random() * (canvas.height - 50) + 50,
              width: 30,
              height: 20,
            },
          ]);
        }

        // Draw airplane (using loaded image)
        if (airplaneImage) {
          ctx.drawImage(airplaneImage, airplane.x, airplane.y, airplane.width, airplane.height);
        }

        // Draw bullets (using loaded image)
        if (bulletImage) {
          bullets.forEach((bullet) => {
            ctx.drawImage(bulletImage, bullet.x, bullet.y, 10, 10);
          });
        }

        // Draw enemies (using loaded image)
        if (enemyImage) {
          enemies.forEach((enemy) => {
            ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
          });
        }

        // Draw score
        ctx.font = '20px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText(`Score: ${score}`, 10, 30);

        requestAnimationFrame(gameLoop);
      };

      // Start game loop
      gameLoop();

      // Handle keyboard events
      window.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
          airplane.velocityX = -5;
        } else if (event.key === 'ArrowRight') {
          airplane.velocityX = 5;
        } else if (event.key === ' ') {
          setBullets([
            ...bullets,
            {
              x: airplane.x + airplane.width / 2 - 5,
              y: airplane.y,
            },
          ]);
        }
      });

      window.addEventListener('keyup', (event) => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          airplane.velocityX = 0;
        }
      });

      return () => {
        window.removeEventListener('keydown', (event) => {
          // Remove event listener
        });
        window.removeEventListener('keyup', (event) => {
          // Remove event listener
        });
      };
    }, []);

    const resetGame = () => {
      setScore(0);
      setAirplane({
        x: 100,
        y: 400,
        width: 50,
        height: 30,
        velocityX: 0,
      });
      setBullets([]);
      setEnemies([]);
      setGameOver(false);
    };

    return React.createElement(
      'div',
      { className: 'airplane-shooting' },
      React.createElement('h2', null, 'Airplane Shooting'),
      React.createElement('canvas', { ref: canvasRef, width: 400, height: 600 }),
      React.createElement('p', null, `Score: ${score}`),
      gameOver && (
        React.createElement(
          'div',
          { className: 'game-over' },
          React.createElement('p', null, `Game Over! Your score: ${score}`),
          React.createElement('button', { onClick: resetGame }, 'Play Again')
        )
      )
    );
  };

  return () => React.createElement(AirplaneShooting, { assetsUrl: assetsUrl });
};

console.log('Airplane Shooting script loaded');console.log('Doodle Jump script loaded');
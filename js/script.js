document.addEventListener('DOMContentLoaded', () => {
    // Плавная прокрутка
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Анимация при скролле
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-scroll]').forEach(element => {
        element.style.opacity = "0";
        element.style.transform = "translateY(30px)";
        observer.observe(element);
    });

    // Боковое меню
    const sideMenu = document.getElementById('sideMenu');
    const aboutBtn = document.getElementById('aboutBtn');

    aboutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        sideMenu.style.left = '0';
    });

    document.querySelector('.close-btn').addEventListener('click', () => {
        sideMenu.style.left = '-300px';
    });

    // Закрытие меню при клике вне его
    document.addEventListener('click', (e) => {
        if (!sideMenu.contains(e.target) && !aboutBtn.contains(e.target)) {
            sideMenu.style.left = '-300px';
        }
    });

    // Изменение прозрачности навигации при скролле
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(51,78,172, 0.7)';
        } else {
            nav.style.background = 'rgba(51,78,172, 0.7)';
        }
    });
});

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Получаем размеры контейнера
const container = document.getElementById('scene-container');
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Освещение
const ambientLight = new THREE.AmbientLight(0x404040, 5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

// Переменная для хранения микшера анимаций
let mixer;

// Загрузка модели
const loader = new THREE.GLTFLoader();
loader.load(
    './3d/nuannimnbrororooror.glb', // Путь к модели
    function (gltf) {
        const model = gltf.scene;
        scene.add(model);

        // Настройка позиции и масштаба
        model.position.set(0, 0, 0);
        model.scale.set(1, 1, 1);

        // Создаем AnimationMixer
        mixer = new THREE.AnimationMixer(model);

        // Получаем анимации из модели
        const clips = gltf.animations;

        // Проигрываем все анимации
        if (clips && clips.length > 0) {
            clips.forEach(clip => {
                const action = mixer.clipAction(clip);
                action.play();
            });
        } else {
            console.warn('No animations found in the model.');
        }
    },
    undefined,
    function (error) {
        console.error('An error happened while loading the model:', error);
    }
);

scene.background = new THREE.Color(0x020130); // Голубой цвет

// Позиция камеры
camera.position.z = 5;

// Инициализация OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Включаем эффект инерции для плавности
controls.dampingFactor = 0.05; // Сила инерции
controls.screenSpacePanning = true;
controls.minDistance = 2; // Минимальное расстояние для приближения
controls.maxDistance = 10; // Максимальное расстояние для отдаления
controls.maxPolarAngle = Math.PI / 2; // Ограничиваем угол вращения по вертикали

// Переменная для отслеживания времени
let clock = new THREE.Clock();

// Анимация
function animate() {
    requestAnimationFrame(animate);

    // Обновляем AnimationMixer
    if (mixer) {
        const delta = clock.getDelta();
        mixer.update(delta);
    }

    // Обновляем OrbitControls
    controls.update();

    renderer.render(scene, camera);
}
animate();

// Обработка изменения размера окна
window.addEventListener('resize', () => {
    const container = document.getElementById('scene-container');
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Обновляем размеры рендерера
    renderer.setSize(width, height);

    // Обновляем соотношение сторон камеры
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});
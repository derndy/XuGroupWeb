class Gallery {
    constructor() {
        this.currentIndex = 0;
        this.images = [];
        this.scale = 1;
        this.translateX = 0;
        this.translateY = 0;
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.isLandscapeMode = false;

        window.openModal = this.openModal.bind(this);
        window.closeModal = this.closeModal.bind(this);
        window.showPreviousImage = this.showPreviousImage.bind(this);
        window.showNextImage = this.showNextImage.bind(this);
        window.toggleRotate = this.toggleRotate.bind(this);

        this.init();
    }

    async init() {
        await this.loadData();
        this.generateThumbnails();
        this.setupEventListeners();
    }

    async loadData() {
        try {
            // 添加时间戳参数，避免浏览器缓存旧 JSON
            const response = await fetch(window.GALLERY_CONFIG.dataUrl + '?v=' + Date.now());
            const data = await response.json();
            
            this.thumbnailBasePath = data.basePaths.thumbnails;
            this.imageBasePath = data.basePaths.images;
            
            this.images = data.images.map((item, index) => ({
                thumbSrc: this.thumbnailBasePath + item.fileName.replace(/\.(jpg|jpeg|png|webp)$/, '_t.$1'),
                src: this.imageBasePath + item.fileName,
                alt: item.fileName.replace(/_/g, ' ').replace(/\..+$/, ''),
                year: item.year,
                index: index
            }));
        } catch (error) {
            console.error('Failed to load gallery data:', error);
        }
    }

    generateThumbnails() {
        const container = document.getElementById('gallery-container');
        if (!container) return;

        const years = [...new Set(this.images.map(img => img.year))].sort((a, b) => b - a);
        container.innerHTML = '';

        years.forEach(year => {
            const yearImages = this.images.filter(img => img.year === year);
            if (yearImages.length > 0) {
                const title = document.createElement('h2');
                title.className = 'text-xl text-center my-4';
                title.textContent = year;
                container.appendChild(title);

                const thumbnailsDiv = document.createElement('div');
                thumbnailsDiv.className = 'gallery-thumbnails';
                thumbnailsDiv.id = `thumbnails${year}`;
                container.appendChild(thumbnailsDiv);

                this.generateThumbnailsForYear(yearImages, `thumbnails${year}`);
            }
        });
    }

    generateThumbnailsForYear(images, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';
        images.forEach(image => {
            const thumbnail = document.createElement('div');
            thumbnail.className = 'thumbnail-container';

            const loading = document.createElement('div');
            loading.className = 'loading-text';
            loading.textContent = 'loading';
            thumbnail.appendChild(loading);

            const img = document.createElement('img');
            img.loading = 'lazy';
            img.src = image.thumbSrc;
            img.alt = `Thumbnail ${image.alt}`;
            img.onload = () => {
                img.classList.add('loaded');
                loading.style.display = 'none';
                
                // 新增：动态调整容器比例（基于图片natural尺寸）
                if (img.naturalWidth && img.naturalHeight) {
                    const aspectRatio = img.naturalWidth / img.naturalHeight;
                    thumbnail.style.aspectRatio = aspectRatio;  // 设容器宽/高 = 图片比例
                    thumbnail.style.background = 'none';  // 可选：去灰背景（充满后无需）
                }
            };
            // 可选：加onerror处理
            img.onerror = () => {
                console.error(`Failed to load thumb: ${image.thumbSrc}`);
                loading.textContent = 'Error';
            };

            thumbnail.onclick = () => this.openModal(image.index);

            thumbnail.appendChild(img);
            container.appendChild(thumbnail);
        });
    }

    openModal(index, isLandscape = false) {
        this.currentIndex = index;
        this.isLandscapeMode = isLandscape;
        const modal = document.getElementById('modal');
        const landscapeModal = document.getElementById('landscapeModal');
        const modalImage = document.getElementById('modalImage');
        const landscapeModalImage = document.getElementById('landscapeModalImage');
        const modalLoading = document.getElementById('modalLoading');
        const landscapeModalLoading = document.getElementById('landscapeModalLoading');

        modal.style.display = isLandscape ? 'none' : 'flex';
        landscapeModal.style.display = isLandscape ? 'flex' : 'none';
        const targetImage = isLandscape ? landscapeModalImage : modalImage;
        const targetLoading = isLandscape ? landscapeModalLoading : modalLoading;

        targetLoading.style.display = 'block';
        targetImage.style.opacity = 0;

        const img = new Image();
        img.src = this.images[index].src;
        img.onload = () => {
            targetImage.src = img.src;
            targetImage.alt = this.images[index].alt;
            targetImage.style.opacity = 1;
            targetLoading.style.display = 'none';
            this.resetImageTransform();
            targetImage.style.transform = isLandscape ? 'rotate(90deg)' : 'rotate(0deg)';
        };
    }

    closeModal() {
        document.getElementById('modal').style.display = 'none';
        document.getElementById('landscapeModal').style.display = 'none';
        document.getElementById('modalImage').src = '';
        document.getElementById('landscapeModalImage').src = '';
        this.resetImageTransform();
        this.isLandscapeMode = false;
    }

    showPreviousImage() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.openModal(this.currentIndex, this.isLandscapeMode);
    }

    showNextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.openModal(this.currentIndex, this.isLandscapeMode);
    }

    toggleRotate() {
        this.isLandscapeMode = !this.isLandscapeMode;
        this.openModal(this.currentIndex, this.isLandscapeMode);
    }

    resetImageTransform() {
        this.scale = 1;
        this.translateX = 0;
        this.translateY = 0;
        this.applyTransform();
        this.updateCursorStyle();
    }

    applyTransform() {
        const modalImage = document.getElementById('modalImage');
        const landscapeModalImage = document.getElementById('landscapeModalImage');
        const targetImage = this.isLandscapeMode ? landscapeModalImage : modalImage;
        if (targetImage) {
            const rotation = this.isLandscapeMode ? 90 : 0;
            targetImage.style.transform = `rotate(${rotation}deg) scale(${this.scale}) translate(${this.translateX}px, ${this.translateY}px)`;
        }
    }

    updateCursorStyle() {
        const modalImage = document.getElementById('modalImage');
        const landscapeModalImage = document.getElementById('landscapeModalImage');
        const targetImage = this.isLandscapeMode ? landscapeModalImage : modalImage;
        if (targetImage) {
            targetImage.style.cursor = this.scale > 1 ? 'grab' : 'default';
        }
    }

    restrictTranslate() {
        const modalContent = document.querySelector(this.isLandscapeMode ? '.landscape-modal-content' : '.modal-content');
        const modalImage = document.getElementById(this.isLandscapeMode ? 'landscapeModalImage' : 'modalImage');
        if (!modalContent || !modalImage) return;

        const containerRect = modalContent.getBoundingClientRect();
        const naturalWidth = modalImage.naturalWidth;
        const naturalHeight = modalImage.naturalHeight;
        const isRotated = this.isLandscapeMode;

        // 计算图片在当前缩放和旋转状态下的实际显示尺寸
        let displayWidth = isRotated ? naturalHeight * this.scale : naturalWidth * this.scale;
        let displayHeight = isRotated ? naturalWidth * this.scale : naturalHeight * this.scale;

        // 如果图片未完全加载，跳过限制
        if (naturalWidth === 0 || naturalHeight === 0) return;

        // 计算图片在容器中的显示比例，确定是否需要调整
        const containerAspect = containerRect.width / containerRect.height;
        const imageAspect = naturalWidth / naturalHeight;
        let fitWidth, fitHeight;

        if (isRotated) {
            // 横屏模式，宽高交换
            if (imageAspect > containerAspect) {
                fitHeight = containerRect.height;
                fitWidth = fitHeight * imageAspect;
            } else {
                fitWidth = containerRect.width;
                fitHeight = fitWidth / imageAspect;
            }
        } else {
            // 竖屏模式
            if (imageAspect < containerAspect) {
                fitWidth = containerRect.width;
                fitHeight = fitWidth / imageAspect;
            } else {
                fitHeight = containerRect.height;
                fitWidth = fitHeight * imageAspect;
            }
        }

        // 调整缩放后的显示尺寸，考虑初始适应
        displayWidth = fitWidth * this.scale;
        displayHeight = fitHeight * this.scale;

        // X轴限制：确保左边缘向右拖拽时不过矩形A的左侧，右边缘向左拖拽时不过右侧
        if (displayWidth <= containerRect.width) {
            this.translateX = 0; // 图片宽度小于容器，居中
        } else {
            // 左边缘限制：向右拖拽时，左边缘不得超过容器左边界
            const maxX = (displayWidth - containerRect.width) / (2 * this.scale);
            // 右边缘限制：向左拖拽时，右边缘不得超过容器右边界
            const minX = -(displayWidth - containerRect.width) / (2 * this.scale);
            this.translateX = Math.max(minX, Math.min(maxX, this.translateX));
        }

        // Y轴限制：确保顶部向下拖拽时不过容器顶部，底部向上拖拽时不过容器底部
        if (displayHeight <= containerRect.height) {
            this.translateY = 0; // 图片高度小于容器，居中
        } else {
            const maxY = (displayHeight - containerRect.height) / (2 * this.scale);
            const minY = -maxY;
            this.translateY = Math.max(minY, Math.min(maxY, this.translateY));
        }
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            const modal = document.getElementById('modal');
            const landscapeModal = document.getElementById('landscapeModal');
            if (modal.style.display === 'flex' || landscapeModal.style.display === 'flex') {
                if (e.key === 'ArrowLeft') this.showPreviousImage();
                else if (e.key === 'ArrowRight') this.showNextImage();
                else if (e.key === 'Escape') this.closeModal();
            }
        });

        ['modal', 'landscapeModal'].forEach(modalId => {
            const modal = document.getElementById(modalId);
            modal.addEventListener('click', (e) => {
                const modalContent = modal.querySelector(modalId === 'modal' ? '.modal-content' : '.landscape-modal-content');
                if (!modalContent.contains(e.target)) this.closeModal();
            });

            const modalImage = document.getElementById(modalId === 'modal' ? 'modalImage' : 'landscapeModalImage');

            modalImage.addEventListener('wheel', (e) => {
                e.preventDefault();
                const delta = e.deltaY > 0 ? -0.1 : 0.1;
                this.scale = Math.min(Math.max(1, this.scale + delta), 3);
                if (this.scale <= 1) {
                    this.resetImageTransform();
                } else {
                    this.restrictTranslate();
                    this.applyTransform();
                    this.updateCursorStyle();
                }
            });

            modalImage.addEventListener('mousedown', (e) => {
                if (this.scale <= 1) return;
                e.preventDefault();
                this.isDragging = true;
                this.startX = e.clientX;
                this.startY = e.clientY;
                modalImage.style.cursor = 'grabbing';
                modalImage.style.transition = 'none';
            });

            modalImage.addEventListener('touchstart', (e) => {
                if (e.touches.length === 1 && this.scale > 1) {
                    e.preventDefault();
                    this.isDragging = true;
                    const touch = e.touches[0];
                    this.startX = touch.clientX;
                    this.startY = touch.clientY;
                    modalImage.style.transition = 'none';
                }
            });

            modalImage.addEventListener('touchmove', (e) => {
                if (e.touches.length === 1 && this.isDragging) {
                    e.preventDefault();
                    const touch = e.touches[0];
                    const deltaX = (touch.clientX - this.startX) / this.scale;
                    const deltaY = (touch.clientY - this.startY) / this.scale;

                    if (this.isLandscapeMode) {
                        this.translateX += deltaY;
                        this.translateY -= deltaX;
                    } else {
                        this.translateX += deltaX;
                        this.translateY += deltaY;
                    }

                    this.restrictTranslate();
                    this.applyTransform();
                    this.startX = touch.clientX;
                    this.startY = touch.clientY;
                }
            });

            modalImage.addEventListener('touchend', () => {
                if (this.isDragging) {
                    this.isDragging = false;
                    modalImage.style.transition = 'transform 0.1s ease-out';
                }
            });

            let initialDistance = 0;
            modalImage.addEventListener('touchstart', (e) => {
                if (e.touches.length === 2) {
                    const touch1 = e.touches[0];
                    const touch2 = e.touches[1];
                    initialDistance = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
                }
            });

            modalImage.addEventListener('touchmove', (e) => {
                if (e.touches.length === 2) {
                    e.preventDefault();
                    const touch1 = e.touches[0];
                    const touch2 = e.touches[1];
                    const currentDistance = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
                    const scaleChange = currentDistance / initialDistance;
                    this.scale = Math.min(Math.max(1, this.scale * scaleChange), 3);
                    initialDistance = currentDistance;

                    if (this.scale <= 1) this.resetImageTransform();
                    else {
                        this.restrictTranslate();
                        this.applyTransform();
                        this.updateCursorStyle();
                    }
                }
            });
        });

        document.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            e.preventDefault();
            const modalImage = document.getElementById(this.isLandscapeMode ? 'landscapeModalImage' : 'modalImage');
            const deltaX = (e.clientX - this.startX) / this.scale;
            const deltaY = (e.clientY - this.startY) / this.scale;

            if (this.isLandscapeMode) {
                this.translateX += deltaY;
                this.translateY -= deltaX;
            } else {
                this.translateX += deltaX;
                this.translateY += deltaY;
            }

            this.restrictTranslate();
            this.applyTransform();
            this.startX = e.clientX;
            this.startY = e.clientY;
        });

        document.addEventListener('mouseup', () => {
            if (this.isDragging) {
                this.isDragging = false;
                const modalImage = document.getElementById(this.isLandscapeMode ? 'landscapeModalImage' : 'modalImage');
                modalImage.style.cursor = 'grab';
                modalImage.style.transition = 'transform 0.1s ease-out';
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => new Gallery());
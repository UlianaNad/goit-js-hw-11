
import { PhotosAPI } from "./photos_api";

const formEl = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const photosAPI = new PhotosAPI();

formEl.addEventListener('submit', onFormSubmit);

async function onFormSubmit(ev){
    ev.preventDefault();
    photosAPI.page = 1;
    photosAPI.query = ev.target.elements.searchQuery.value;

    const photosData = await photosAPI.fetchPhotos();
    gallery.innerHTML = '';
    renderPhotos(photosData.hits);
    loadMoreBtn.disabled = false;
}

loadMoreBtn.addEventListener('click', onLoadMoreBtn);

async function onLoadMoreBtn(e){
    photosAPI.page += 1; 

    const photosData = await photosAPI.fetchPhotos();
    renderPhotos(photosData.hits);
    loadMoreBtn.disabled = false;
}

function photosTemplate(photos){
    
    return photos.map(photo => {
        return` <div class="photo-card">
                    <img src="${photo.webformatURL}" alt="" loading="lazy" />
                    <div class="info">
                        <p class="info-item">
                            <b>Likes</b>: ${photo.likes}
                        </p>
                        <p class="info-item">
                            <b>Views</b>: ${photo.views}
                        </p>
                        <p class="info-item">
                            <b>Comments</b>: ${photo.comments}
                        </p>
                        <p class="info-item">
                            <b>Downloads</b>: ${photo.downloads}
                        </p>
                    </div>
                </div>`;
    }).join('');
}


function renderPhotos(photos){
    const markup = photosTemplate(photos);
    gallery.insertAdjacentHTML('beforeend', markup)
}

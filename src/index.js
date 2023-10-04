import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { PhotosAPI } from "./photos_api";

const formEl = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const photosAPI = new PhotosAPI();

formEl.addEventListener('submit', onFormSubmit);
//loadMoreBtn.disabled = true;


async function onFormSubmit(ev){
    ev.preventDefault();
    photosAPI.page = 1;
    checkLoadMoreBtn();
    photosAPI.query = ev.target.elements.searchQuery.value;

    const photosData = await photosAPI.fetchPhotos();
    photosAPI.maxPage = Math.ceil(photosData.totalHites/photosAPI.pageSize);
    gallery.innerHTML = '';
    renderPhotos(photosData.hits);
}

loadMoreBtn.addEventListener('click', onLoadMoreBtn);

async function onLoadMoreBtn(e){
    photosAPI.page += 1; 
    checkLoadMoreBtn();
    const photosData = await photosAPI.fetchPhotos();
    renderPhotos(photosData.hits);
    getData(photosData.hits)
}

function photosTemplate(photos){
    
    return photos.map(photo => {
        return` <div class="photo-card card shadow-sm ">
                    <img class="card-img-top" 
                    width="100%" height="225" src="${photo.webformatURL}" 
                    alt="${photo.tags}" loading="lazy" 
                    preserveAspectRatio="xMidYMid slice"
                    focusable="false"/>
                    <div class="info d-flex justify-content-between align-items-center">
                        <p class="info-item text-body-secondary text-center mt-2">
                            <b>Likes</b>: ${photo.likes}
                        </p>
                        <p class="info-item text-body-secondary text-center mt-2">
                            <b>Views</b>: ${photo.views}
                        </p>
                        <p class="info-item text-body-secondary text-center mt-2">
                            <b>Comments</b>: ${photo.comments}
                        </p>
                        <p class="info-item text-body-secondary text-center mt-2">
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

function checkLoadMoreBtn(){
    // const isActive = photosAPI.page === photosAPI.maxPage;
    // loadMoreBtn.disabled = isActive;

    if(photosAPI.page === photosAPI.maxPage){
        loadMoreBtn.disabled = true;
        const message = "We're sorry, but you've reached the end of search results.";
        //loadMoreBtn.classList.add('is-hidden');
    } else if (photosAPI.page === 1){
        loadMoreBtn.disabled = false;
        //loadMoreBtn.classList.remove('is-hidden');
    }

}
checkLoadMoreBtn();

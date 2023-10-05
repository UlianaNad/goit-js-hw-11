import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { PhotosAPI } from "./photos_api";

import SimpleLightbox from "simplelightbox";

import "simplelightbox/dist/simple-lightbox.min.css";

const formEl = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const loadMoreBtnWrapper = document.querySelector('.load-more-wrapper');


const photosAPI = new PhotosAPI();

//прослуховувачі
formEl.addEventListener('submit', onFormSubmit);

loadMoreBtn.addEventListener('click', onLoadMoreBtn);

// Basic
checkLoadMoreBtn();
showLoadMoreButton(photosAPI.page);
loadMoreBtnWrapper.innerHTML = '';


// functions

async function onFormSubmit(ev){
    ev.preventDefault();

    photosAPI.page = 1;
    loadMoreBtnWrapper.innerHTML = '';

    showLoader();

    const searchQuery = ev.target.elements.searchQuery.value.trim();

    if(!searchQuery){
        return Notify.info('The search is empty!')
    }

    photosAPI.query = searchQuery;

    try{
        const photosData = await photosAPI.fetchPhotos();
        photosAPI.maxPage = Math.ceil(photosData.totalHits/photosAPI.pageSize);
        checkLoadMoreBtn();
    
        showSearchResult(photosData.totalHits);
    
        showLoadMoreButton(photosAPI.maxPage);
    
        gallery.innerHTML = '';
    
        renderPhotos(photosData.hits);
        
        if(photosAPI.page === photosAPI.maxPage ){
            showEndMessage();
        }
        if(photosData.totalHits === 0){
            loadMoreBtnWrapper.innerHTML = '';
        }
    } catch(error){
        throw new Error;
    } finally{
        hideLoader();
    }
}


async function onLoadMoreBtn(){
    showLoader();

    photosAPI.page += 1; 
    checkLoadMoreBtn();
    
    try{
        const photosData = await photosAPI.fetchPhotos();
        
        renderPhotos(photosData.hits);

        if(photosAPI.page === photosAPI.maxPage ){
            showEndMessage();
        }
        if(photosData.totalHits === 0){
            loadMoreBtnWrapper.innerHTML = '';
        }
    }catch{
        throw new Error;
    }finally{
        hideLoader();
    }
}

function photosTemplate(photos){
    return photos.map(photo => {
        return` <div class="card shadow-sm g-col-4" style="max-width: 20rem;">
                    <a class="gallery__link" href="${photo.largeImageURL}">
                        <img class="card-img-top mt-2" width="100%" height="225" src="${photo.webformatURL}" alt="${photo.tags}" loading="lazy" preserveAspectRatio="xMidYMid slice"focusable="false"/>
                    </a>
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

 
// render info
function renderPhotos(photos){
    const markup = photosTemplate(photos);
    gallery.insertAdjacentHTML('beforeend', markup);
    new SimpleLightbox('.gallery a', {
        captionsData: 'alt',
        captionDelay: 250,
     });
}
// check loadmoreButton status
function checkLoadMoreBtn(){
    const isActive = photosAPI.page === photosAPI.maxPage;
    loadMoreBtn.disabled = isActive;
}

function showLoadMoreButton(page){
    if(page <= 1){
        loadMoreBtn.classList.add('is-hidden');        
    }else{
        loadMoreBtn.classList.remove('is-hidden');
    }
}

function showEndMessage(){
    loadMoreBtn.classList.add('is-hidden');
    document.querySelector('.d-grid').classList.remove('col-4');
    document.querySelector('.d-grid').classList.add('col-8');
    const message = "We're sorry, but you've reached the end of search results.";
    loadMoreBtnWrapper.innerHTML = message;
}

function showSearchResult(totalHits){
    if(totalHits === 0 ){
        Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    } else {
        Notify.success(`Hooray! We found ${totalHits} images.`)
    }
}

function showLoader(){
    document.body.classList.add('show-loader');

}
function hideLoader(){
    document.body.classList.remove('show-loader');
}
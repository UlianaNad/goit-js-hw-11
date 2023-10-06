import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { PhotosAPI } from "./photos_api";
import { photosTemplate } from './templates';

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

    const searchQuery = ev.target.elements.searchQuery.value.trim();

    if(!searchQuery){
        gallery.innerHTML = '';
        loadMoreBtn.classList.add('is-hidden');
        return Notify.info('The search is empty!');
    }else{
        showLoader();
        photosAPI.query = searchQuery;
    }

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
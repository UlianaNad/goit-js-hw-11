export function photosTemplate(photos){
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
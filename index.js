document.addEventListener('DOMContentLoaded', () => {
    // GET videos and render to DOM onload
    fetch("https://jere-eeephase-1capstone.netlify.app/videos")
        .then(res => res.json())
        .then((videos) => {
            vidRenderer(videos);
        })
    
    // Event listener for home tab
    document.querySelector('.home').addEventListener('click', () => {
        // GET all videos and render
        fetch('https://jere-eeephase-1capstone.netlify.app/videos')
            .then(res => res.json())
            .then((videos) => {
                document.querySelector('.videos').innerHTML = ''
                vidRenderer(videos)
            })
    })

    // Event listener for watch later tab
    document.querySelector('.later').addEventListener('click', () => {
        watchLaterRenderer();
    })

    // Event listener for liked videos tab
    document.querySelector('.liked').addEventListener('click', () => {
        likesRenderer();
    });

    // Event listener for subscriptions tab
    document.querySelector('.subscriptionss').addEventListener('click', () => {
        subscriptionsRenderer();
    })

    // Event listener for theme checkbox slider
    document.querySelector('.checkbox').addEventListener('change', function() {
        toggle();
    })

    // Event listener for theme checkbox slider ("keydown")
    document.addEventListener('keydown', (e) => {
        let activeEl = document.activeElement
        let isInput = activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA" || activeEl.isContentEditable
        if (!isInput) {
            if (e.key === "l") {
                document.querySelector('.checkbox').checked = false
                toggle()
            } else if (e.key === "d") {
                document.querySelector('.checkbox').checked = true
                toggle()
            }
        }
    })
})

const content = document.querySelector(".content");

// renderer function for videos in subscriptions tab
function subscriptionsRenderer() {
    fetch('https://jere-eeephase-1capstone.netlify.app/subscriptions')
        .then(res => res.json())
        .then((videos) => {
            console.log(videos);
            document.querySelector('.videos').innerHTML = '';
            if (videos.length > 0) {
                const videoContainer = document.querySelector('.videos');

                videos.forEach((vid) => {
                    let vidDiv = document.createElement('div');
                    vidDiv.classList.add('video');
                    vidDiv.innerHTML = `
                <div class="thumbnail">
                    <img src="${vid.thumbnail}" />
                </div>

                <div class="details">
                    <div class="title">
                        <h3>
                           ${vid.title}
                        </h3>
                        <a href="#">
                            ${vid.channelName}
                        </a>
                        <span> ${vid.views} Views • ${vid.likes} Likes</span>
                    </div>
                </div>
                `;
                    videoContainer.appendChild(vidDiv);
                    // const content = document.querySelector(".content");
                    vidDiv.addEventListener('click', () => {
                        let previewer = document.querySelector(".previewer");
                        if (!previewer) {
                            previewer = document.createElement("div");
                            previewer.classList.add("previewer");
                            content.append(previewer);
                        }
                        previewer.style.display = "flex";
                        previewer.textContent = '';
                        fetch(`https://jere-eeephase-1capstone.netlify.app/videos/${vid.id}`)
                            .then((r) => r.json())
                            .then((vid) => {
                                let videoContent = document.createElement("div");
                                videoContent.classList.add("preview-content");
                                videoContent.innerHTML = `<div class="thumbnails">
                                                    <img src="${vid.thumbnail}" />
                                                </div>

                                                <div class="detailss">
                                                    <div class="titles">
                                                        <h3>
                                                        ${vid.title}
                                                        </h3>
                                                        <p class="description">${vid.description}</p>
                                                        <a href="#">
                                                            ${vid.channelName}
                                                        </a>
                                                        <span class="previewss"> ${vid.views} Views • ${vid.likes} Likes</span>
                                                        <button class="subscribe">Unsubscribe</button>
                                                        <button class="like"><i class="fa-solid fa-thumbs-up"></i> Like</button>
                                                        <button class="watch-later"><i class="fa-regular fa-clock"></i>  Watch Later</button>
                                                        <button class="exit"><i class="fa-regular fa-circle-xmark"></i>  Exit</button>
                                                        </div>
                                                </div>`;


                                videoContent.append();
                                previewer.appendChild(videoContent);
                                document.querySelector('.exit').addEventListener('click', () => {
                                    previewer.style.display = "none";
                                });
                                let unsubscribeHandler = null;
                                if (unsubscribeHandler !== null) {
                                    document.querySelector('.subscribe').removeEventListener('click', subscribeHandler);
                                }
                                unsubscribeHandler = () => {
                                    fetch(`https://jere-eeephase-1capstone.netlify.app/subscriptions/${vid.id}`, {
                                        method: "DELETE",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify(vid)
                                    })
                                        .then(res => res.json())
                                        .then(data => {
                                            console.log(data);
                                            previewer.style.display = "none";
                                            vidDiv.remove();
                                            if (videoContainer.innerHTML == '') {
                                                emptyDivFunc();
                                                document.querySelector('.nuthin').innerHTML = `Nothing here yet <i class="fa-regular fa-face-smile-wink"></i>`;
                                                document.querySelector('.extra').textContent = `Subscribe to channels to show their videos here.`;
                                            }

                                        });
                                };
                                document.querySelector('.subscribe').addEventListener('click', () => {
                                    unsubscribeHandler();
                                });

                                let likeHandler = null;
                                let isLiked = false;
                                if (likeHandler !== null) {
                                    document.querySelector('.like').removeEventListener('click', likeHandler);
                                }
                                likeHandler = () => {
                                    fetch('https://jere-eeephase-1capstone.netlify.app/likes', {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify(vid)
                                    })
                                        .then(res => res.json())
                                        .then(data => {
                                            console.log(data);
                                            document.querySelector('.like').innerHTML = `<i class="fa-solid fa-thumbs-down"></i>  Unlike`;
                                            document.querySelector('.previewss').innerHTML = `${vid.views} Views • ${vid.likes + 1} Likes`;
                                            isLiked = true;
                                        });
                                };
                                let unlikeHandler = null;
                                if (unlikeHandler !== null) {
                                    document.querySelector('.like').removeEventListener('click', likeHandler);
                                }
                                unlikeHandler = () => {
                                    fetch(`https://jere-eeephase-1capstone.netlify.app/likes/${vid.id}`, {
                                        method: "DELETE",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify(vid)
                                    })
                                        .then(res => res.json())
                                        .then(data => {
                                            console.log(data);
                                            previewer.style.display = "none";
                                            vidDiv.remove();
                                            if (videoContainer.innerHTML == '') {
                                                emptyDivFunc();
                                                document.querySelector('.nuthin').innerHTML = `Nothing here unfortunately <i class="fa-regular fa-face-frown"></i>`;
                                                document.querySelector('.extra').textContent = `When you add videos to "Liked Videos" they'll appear here.`;
                                                isLiked = false;
                                            }
                                        });
                                };

                                document.querySelector('.like').addEventListener('click', () => {
                                    isLiked ? unlikeHandler() : likeHandler();
                                });

                                let laterHandler = null;
                                let isLater = false;
                                if (laterHandler !== null) {
                                    document.querySelector('.watch-later').removeEventListener('click', laterHandler);
                                }
                                laterHandler = () => {
                                    fetch('https://jere-eeephase-1capstone.netlify.app/watchLater', {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify(vid)
                                    })
                                        .then(res => res.json())
                                        .then(data => {
                                            console.log(data);
                                            document.querySelector('.watch-later').innerHTML = `<i class="fa-solid fa-trash"></i>  Remove from "Watch Later"`;
                                            isLater = true;
                                        });
                                };
                                let unlaterHandler = null;
                                if (unlaterHandler !== null) {
                                    document.querySelector('.watch-later').removeEventListener('click', laterHandler);
                                }
                                unlaterHandler = () => {
                                    fetch(`https://jere-eeephase-1capstone.netlify.app/watchLater/${vid.id}`, {
                                        method: "DELETE",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify(vid)
                                    })
                                        .then(res => res.json())
                                        .then(data => {
                                            console.log(data);
                                            document.querySelector('.watch-later').innerHTML = `<i class="fa-regular fa-clock"></i>  Watch Later`;
                                            isLater = false;
                                        });
                                };

                                document.querySelector('.watch-later').addEventListener('click', () => {
                                    isLater ? unlaterHandler() : laterHandler();
                                });
                            });

                    });
                });
            } else {
                console.log('Nuthin');
                emptyDivFunc();
                document.querySelector('.nuthin').innerHTML = `Nothing here yet <i class="fa-regular fa-face-smile-wink"></i>`;
                document.querySelector('.extra').textContent = `Subscribe to channels to show their videos here.`;
            };
        });
}

// renderer function for videos in liked videos tab
function likesRenderer() {
    fetch('https://jere-eeephase-1capstone.netlify.app/likes')
        .then(res => res.json())
        .then((videos) => {
            console.log(videos);
            document.querySelector('.videos').innerHTML = '';
            if (videos.length > 0) {
                const videoContainer = document.querySelector('.videos');

                videos.forEach((vid) => {
                    let vidDiv = document.createElement('div');
                    vidDiv.classList.add('video');
                    vidDiv.innerHTML = `
                <div class="thumbnail">
                    <img src="${vid.thumbnail}" />
                </div>

                <div class="details">
                    <div class="title">
                        <h3>
                           ${vid.title}
                        </h3>
                        <a href="#">
                            ${vid.channelName}
                        </a>
                        <span> ${vid.views} Views • ${vid.likes} Likes</span>
                    </div>
                </div>
                `;
                    videoContainer.appendChild(vidDiv);
                    // const content = document.querySelector(".content");
                    vidDiv.addEventListener('click', () => {
                        let previewer = document.querySelector(".previewer");
                        if (!previewer) {
                            previewer = document.createElement("div");
                            previewer.classList.add("previewer");
                            content.append(previewer);
                        }
                        previewer.style.display = "flex";
                        previewer.textContent = '';
                        fetch(`https://jere-eeephase-1capstone.netlify.app/videos/${vid.id}`)
                            .then((r) => r.json())
                            .then((vid) => {
                                let videoContent = document.createElement("div");
                                videoContent.classList.add("preview-content");
                                videoContent.innerHTML = `<div class="thumbnails">
                                                    <img src="${vid.thumbnail}" />
                                                </div>

                                                <div class="detailss">
                                                    <div class="titles">
                                                        <h3>
                                                        ${vid.title}
                                                        </h3>
                                                        <p class="description">${vid.description}</p>
                                                        <a href="#">
                                                            ${vid.channelName}
                                                        </a>
                                                        <span class="previewss"> ${vid.views} Views • ${vid.likes} Likes</span>
                                                        <button class="subscribe">Subscribe</button>
                                                        <button class="like"><i class="fa-solid fa-thumbs-down"></i>  Unlike</button>
                                                        <button class="watch-later"><i class="fa-regular fa-clock"></i>  Watch Later</button>
                                                        <button class="exit"><i class="fa-regular fa-circle-xmark"></i>  Exit</button>
                                                        </div>
                                                </div>`;


                                videoContent.append();
                                previewer.appendChild(videoContent);
                                document.querySelector('.exit').addEventListener('click', () => {
                                    previewer.style.display = "none";
                                });
                                let subscribeHandler = null;
                                let isSubscribed = false;
                                if (subscribeHandler !== null) {
                                    document.querySelector('.subscribe').removeEventListener('click', subscribeHandler);
                                }
                                subscribeHandler = () => {
                                    fetch('https://jere-eeephase-1capstone.netlify.app/subscriptions', {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify(vid)
                                    })
                                        .then(res => res.json())
                                        .then(data => {
                                            console.log(data);
                                            document.querySelector('.subscribe').textContent = 'Unsubscribe';
                                            isSubscribed = true;
                                        });
                                };
                                let unsubscribeHandler = null;
                                if (unsubscribeHandler !== null) {
                                    document.querySelector('.subscribe').removeEventListener('click', subscribeHandler);
                                }
                                unsubscribeHandler = () => {
                                    fetch(`https://jere-eeephase-1capstone.netlify.app/subscriptions/${vid.id}`, {
                                        method: "DELETE",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify(vid)
                                    })
                                        .then(res => res.json())
                                        .then(data => {
                                            console.log(data);
                                            document.querySelector('.subscribe').textContent = 'Subscribe';
                                            isSubscribed = false;

                                        });
                                };
                                document.querySelector('.subscribe').addEventListener('click', () => {
                                    isSubscribed ? unsubscribeHandler() : subscribeHandler();
                                });

                                let unlikeHandler = null;
                                if (unlikeHandler !== null) {
                                    document.querySelector('.like').removeEventListener('click', likeHandler);
                                }
                                unlikeHandler = () => {
                                    fetch(`https://jere-eeephase-1capstone.netlify.app/likes/${vid.id}`, {
                                        method: "DELETE",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify(vid)
                                    })
                                        .then(res => res.json())
                                        .then(data => {
                                            console.log(data);
                                            previewer.style.display = "none";
                                            vidDiv.remove();
                                            if (videoContainer.innerHTML == '') {
                                                emptyDivFunc();
                                                document.querySelector('.nuthin').innerHTML = `Nothing here unfortunately <i class="fa-regular fa-face-frown"></i>`;
                                                document.querySelector('.extra').textContent = `When you add videos to "Liked Videos" they'll appear here.`;
                                            }
                                        });
                                };

                                document.querySelector('.like').addEventListener('click', () => {
                                    unlikeHandler();
                                });

                                let laterHandler = null;
                                let isLater = false;
                                if (laterHandler !== null) {
                                    document.querySelector('.watch-later').removeEventListener('click', laterHandler);
                                }
                                laterHandler = () => {
                                    fetch('https://jere-eeephase-1capstone.netlify.app/watchLater', {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify(vid)
                                    })
                                        .then(res => res.json())
                                        .then(data => {
                                            console.log(data);
                                            document.querySelector('.watch-later').innerHTML = `<i class="fa-solid fa-trash"></i>  Remove from "Watch Later"`;
                                            isLater = true;
                                        });
                                };
                                let unlaterHandler = null;
                                if (unlaterHandler !== null) {
                                    document.querySelector('.watch-later').removeEventListener('click', laterHandler);
                                }
                                unlaterHandler = () => {
                                    fetch(`https://jere-eeephase-1capstone.netlify.app/watchLater/${vid.id}`, {
                                        method: "DELETE",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify(vid)
                                    })
                                        .then(res => res.json())
                                        .then(data => {
                                            console.log(data);
                                            document.querySelector('.watch-later').innerHTML = `<i class="fa-regular fa-clock"></i>  Watch Later`;
                                            isLater = false;
                                        });
                                };

                                document.querySelector('.watch-later').addEventListener('click', () => {
                                    isLater ? unlaterHandler() : laterHandler();
                                });
                            });

                    });
                });
            } else {
                emptyDivFunc();
                document.querySelector('.nuthin').innerHTML = `Nothing here unfortunately <i class="fa-regular fa-face-frown"></i>`;
                document.querySelector('.extra').textContent = `When you add videos to "Liked Videos" they'll appear here.`;
            };
        });
}

// renderer function for videos in watch later tab
function watchLaterRenderer() {
    fetch('https://jere-eeephase-1capstone.netlify.app/watchLater')
        .then(res => res.json())
        .then((videos) => {
            console.log(videos);
            document.querySelector('.videos').innerHTML = '';
            if (videos.length > 0) {
                const videoContainer = document.querySelector('.videos');

                videos.forEach((vid) => {
                    let vidDiv = document.createElement('div');
                    vidDiv.classList.add('video');
                    vidDiv.innerHTML = `
                <div class="thumbnail">
                    <img src="${vid.thumbnail}" />
                </div>

                <div class="details">
                    <div class="title">
                        <h3>
                           ${vid.title}
                        </h3>
                        <a href="#">
                            ${vid.channelName}
                        </a>
                        <span> ${vid.views} Views • ${vid.likes} Likes</span>
                    </div>
                </div>
                `;
                    videoContainer.appendChild(vidDiv);
                    // const content = document.querySelector(".content");
                    vidDiv.addEventListener('click', () => {
                        let previewer = document.querySelector(".previewer");
                        if (!previewer) {
                            previewer = document.createElement("div");
                            previewer.classList.add("previewer");
                            content.append(previewer);
                        }
                        previewer.style.display = "flex";
                        previewer.textContent = '';
                        fetch(`https://jere-eeephase-1capstone.netlify.app/videos/${vid.id}`)
                            .then((r) => r.json())
                            .then((vid) => {
                                let videoContent = document.createElement("div");
                                videoContent.classList.add("preview-content");
                                videoContent.innerHTML = `<div class="thumbnails">
                                                    <img src="${vid.thumbnail}" />
                                                </div>

                                                <div class="detailss">
                                                    <div class="titles">
                                                        <h3>
                                                        ${vid.title}
                                                        </h3>
                                                        <p class="description">${vid.description}</p>
                                                        <a href="#">
                                                            ${vid.channelName}
                                                        </a>
                                                        <span class="previewss"> ${vid.views} Views • ${vid.likes} Likes</span>
                                                        <button class="subscribe">Subscribe</button>
                                                        <button class="like"><i class="fa-solid fa-thumbs-up"></i>  Like</button>
                                                        <button class="watch-later"><i class="fa-solid fa-trash"></i>  Remove from "Watch Later"</button>
                                                        <button class="exit"><i class="fa-regular fa-circle-xmark"></i>  Exit</button>
                                                        </div>
                                                </div>`;


                                videoContent.append();
                                previewer.appendChild(videoContent);
                                document.querySelector('.exit').addEventListener('click', () => {
                                    previewer.style.display = "none";
                                });
                                let subscribeHandler = null;
                                let isSubscribed = false;
                                if (subscribeHandler !== null) {
                                    document.querySelector('.subscribe').removeEventListener('click', subscribeHandler);
                                }
                                subscribeHandler = () => {
                                    fetch('https://jere-eeephase-1capstone.netlify.app/subscriptions', {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify(vid)
                                    })
                                        .then(res => res.json())
                                        .then(data => {
                                            console.log(data);
                                            document.querySelector('.subscribe').textContent = 'Unsubscribe';
                                            isSubscribed = true;
                                        });
                                };
                                let unsubscribeHandler = null;
                                if (unsubscribeHandler !== null) {
                                    document.querySelector('.subscribe').removeEventListener('click', subscribeHandler);
                                }
                                unsubscribeHandler = () => {
                                    fetch(`https://jere-eeephase-1capstone.netlify.app/subscriptions/${vid.id}`, {
                                        method: "DELETE",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify(vid)
                                    })
                                        .then(res => res.json())
                                        .then(data => {
                                            console.log(data);
                                            document.querySelector('.subscribe').textContent = 'Subscribe';
                                            isSubscribed = false;

                                        });
                                };
                                document.querySelector('.subscribe').addEventListener('click', () => {
                                    isSubscribed ? unsubscribeHandler() : subscribeHandler();
                                });

                                let likeHandler = null;
                                let isLiked = false;
                                if (likeHandler !== null) {
                                    document.querySelector('.like').removeEventListener('click', likeHandler);
                                }
                                likeHandler = () => {
                                    fetch('https://jere-eeephase-1capstone.netlify.app/likes', {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify(vid)
                                    })
                                        .then(res => res.json())
                                        .then(data => {
                                            console.log(data);
                                            document.querySelector('.like').innerHTML = `<i class="fa-solid fa-thumbs-down"></i>  Unlike`;
                                            document.querySelector('.previewss').innerHTML = `${vid.views} Views • ${vid.likes + 1} Likes`;
                                            isLiked = true;
                                        });
                                };
                                let unlikeHandler = null;
                                if (unlikeHandler !== null) {
                                    document.querySelector('.like').removeEventListener('click', likeHandler);
                                }
                                unlikeHandler = () => {
                                    fetch(`https://jere-eeephase-1capstone.netlify.app/likes/${vid.id}`, {
                                        method: "DELETE",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify(vid)
                                    })
                                        .then(res => res.json())
                                        .then(data => {
                                            console.log(data);
                                            document.querySelector('.like').innerHTML = `<i class="fa-solid fa-thumbs-up"></i> Like`;
                                            document.querySelector('.previewss').innerHTML = `${vid.views} Views • ${vid.likes} Likes`;
                                            isLiked = false;
                                        });
                                };

                                document.querySelector('.like').addEventListener('click', () => {
                                    isLiked ? unlikeHandler() : likeHandler();
                                });

                                let unlaterHandler = null;
                                if (unlaterHandler !== null) {
                                    document.querySelector('.watch-later').removeEventListener('click', unlaterHandler);
                                }
                                unlaterHandler = () => {
                                    fetch(`https://jere-eeephase-1capstone.netlify.app/watchLater/${vid.id}`, {
                                        method: "DELETE",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify(vid)
                                    })
                                        .then(res => res.json())
                                        .then(data => {
                                            console.log(data);
                                            previewer.style.display = "none";
                                            vidDiv.remove();
                                            if (videoContainer.innerHTML == '') {
                                                emptyDivFunc();
                                            }
                                        });
                                };

                                document.querySelector('.watch-later').addEventListener('click', () => {
                                    unlaterHandler();
                                });
                            });

                    });
                });

            } else {
                // console.log('Nuthin')
                emptyDivFunc();
            }
        });
}

// function changing background color on change of checkbox
function toggle() {
    let body = document.querySelector('body');
    let content = document.querySelector('.content');
    let checkbox = document.querySelector('.checkbox')
    if (checkbox.checked) {
        body.style.backgroundColor = "#28292c";
        body.style.color = "#fff";
        content.style.backgroundColor = "#28292c";
        content.style.color = "#fff";
        checkbox.checked = true
    } else if (!checkbox.checked) {
        body.style.backgroundColor = "#f9f9f9";
        body.style.color = "black";
        content.style.backgroundColor = "#f9f9f9";
        content.style.color = "black";
        checkbox.checked = false
    }
}

// function to show div when no videos are in home, subscriptions or watch later endpoints
function emptyDivFunc() {
    let emptyDiv = document.querySelector('.empty');
    if (!emptyDiv) {
        emptyDiv = document.createElement("div");
        emptyDiv.classList.add("empty");
        content.append(emptyDiv);
    }
    emptyDiv.innerHTML = `
                    <h1 class="nuthin">Nothing to see here <i class="fa-regular fa-face-smile-beam"></i></h1>
                    <span class="extra">When you add videos to "Watch Later" they'll appear here.</span>
                `;
    emptyDiv.style.display = "flex";
    emptyDiv.append();
    document.querySelector('.videos').appendChild(emptyDiv);
}

// renderer function for videos in home tab
function vidRenderer(videos) {
    const videoContainer = document.querySelector('.videos');

    videos.forEach((vid) => {
        let vidDiv = document.createElement('div');
        vidDiv.classList.add('video');
        vidDiv.innerHTML = `
                <div class="thumbnail">
                    <img src="${vid.thumbnail}" />
                </div>

                <div class="details">
                    <div class="title">
                        <h3>
                           ${vid.title}
                        </h3>
                        <a href="#">
                            ${vid.channelName}
                        </a>
                        <span> ${vid.views} Views • ${vid.likes} Likes</span>
                    </div>
                </div>
                `;
        videoContainer.appendChild(vidDiv);
        // const content = document.querySelector(".content");
        vidDiv.addEventListener('click', () => {
            let previewer = document.querySelector(".previewer");
            if (!previewer) {
                previewer = document.createElement("div");
                previewer.classList.add("previewer");
                content.append(previewer);
            }
            previewer.style.display = "flex";
            previewer.textContent = '';
            fetch(`https://jere-eeephase-1capstone.netlify.app/videos/${vid.id}`)
                .then((r) => r.json())
                .then((vid) => {
                    let videoContent = document.createElement("div");
                    videoContent.classList.add("preview-content");
                    videoContent.innerHTML = `<div class="thumbnails">
                                                    <img src="${vid.thumbnail}" />
                                                </div>

                                                <div class="detailss">
                                                    <div class="titles">
                                                        <h3>
                                                        ${vid.title}
                                                        </h3>
                                                        <p class="description">${vid.description}</p>
                                                        <a href="#">
                                                            ${vid.channelName}
                                                        </a>
                                                        <span class="previewss"> ${vid.views} Views • ${vid.likes} Likes</span>
                                                        <button class="subscribe">Subscribe</button>
                                                        <button class="like"><i class="fa-solid fa-thumbs-up"></i>  Like</button>
                                                        <button class="watch-later"><i class="fa-regular fa-clock"></i>  Watch Later</button>
                                                        <button class="exit"><i class="fa-regular fa-circle-xmark"></i>  Exit</button>
                                                        </div>
                                                </div>`;


                    videoContent.append();
                    previewer.appendChild(videoContent);
                    document.querySelector('.exit').addEventListener('click', () => {
                        previewer.style.display = "none";
                    });
                    let subscribeHandler = null;
                    let isSubscribed = false;
                    if (subscribeHandler !== null) {
                        document.querySelector('.subscribe').removeEventListener('click', subscribeHandler);
                    }
                    subscribeHandler = () => {
                        fetch('https://jere-eeephase-1capstone.netlify.app/subscriptions', {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(vid)
                        })
                            .then(res => res.json())
                            .then(data => {
                                console.log(data);
                                document.querySelector('.subscribe').textContent = 'Unsubscribe';
                                isSubscribed = true;
                            });
                    };
                    let unsubscribeHandler = null;
                    if (unsubscribeHandler !== null) {
                        document.querySelector('.subscribe').removeEventListener('click', subscribeHandler);
                    }
                    unsubscribeHandler = () => {
                        fetch(`https://jere-eeephase-1capstone.netlify.app/subscriptions/${vid.id}`, {
                            method: "DELETE",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(vid)
                        })
                            .then(res => res.json())
                            .then(data => {
                                console.log(data);
                                document.querySelector('.subscribe').textContent = 'Subscribe';
                                isSubscribed = false;

                            });
                    };
                    document.querySelector('.subscribe').addEventListener('click', () => {
                        isSubscribed ? unsubscribeHandler() : subscribeHandler();
                    });

                    let likeHandler = null;
                    let isLiked = false;
                    if (likeHandler !== null) {
                        document.querySelector('.like').removeEventListener('click', likeHandler);
                    }
                    likeHandler = () => {
                        fetch('https://jere-eeephase-1capstone.netlify.app/likes', {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(vid)
                        })
                            .then(res => res.json())
                            .then(data => {
                                console.log(data);
                                document.querySelector('.like').innerHTML = `<i class="fa-solid fa-thumbs-down"></i>  Unlike`;
                                vid.likes += 1
                                document.querySelector('.previewss').innerHTML = `${vid.views} Views • ${vid.likes} Likes`;
                                isLiked = true;
                            });
                    };
                    let unlikeHandler = null;
                    if (unlikeHandler !== null) {
                        document.querySelector('.like').removeEventListener('click', likeHandler);
                    }
                    unlikeHandler = () => {
                        fetch(`https://jere-eeephase-1capstone.netlify.app/likes/${vid.id}`, {
                            method: "DELETE",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(vid)
                        })
                            .then(res => res.json())
                            .then(data => {
                                console.log(data);
                                document.querySelector('.like').innerHTML = `<i class="fa-solid fa-thumbs-up"></i> Like`;
                                document.querySelector('.previewss').innerHTML = `${vid.views} Views • ${vid.likes} Likes`;
                                isLiked = false;
                            });
                    };

                    document.querySelector('.like').addEventListener('click', () => {
                        isLiked ? unlikeHandler() : likeHandler();
                    });

                    let laterHandler = null;
                    let isLater = false;
                    if (laterHandler !== null) {
                        document.querySelector('.watch-later').removeEventListener('click', laterHandler);
                    }
                    laterHandler = () => {
                        fetch('https://jere-eeephase-1capstone.netlify.app/watchLater', {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(vid)
                        })
                            .then(res => res.json())
                            .then(data => {
                                console.log(data);
                                document.querySelector('.watch-later').innerHTML = `<i class="fa-solid fa-trash"></i>  Remove from "Watch Later"`;
                                isLater = true;
                            });
                    };
                    let unlaterHandler = null;
                    if (unlaterHandler !== null) {
                        document.querySelector('.watch-later').removeEventListener('click', laterHandler);
                    }
                    unlaterHandler = () => {
                        fetch(`https://jere-eeephase-1capstone.netlify.app/watchLater/${vid.id}`, {
                            method: "DELETE",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(vid)
                        })
                            .then(res => res.json())
                            .then(data => {
                                console.log(data);
                                document.querySelector('.watch-later').innerHTML = `<i class="fa-regular fa-clock"></i>  Watch Later`;
                                isLater = false;
                            });
                    };

                    document.querySelector('.watch-later').addEventListener('click', () => {
                        isLater ? unlaterHandler() : laterHandler();
                    });
                });

        });
    });
}

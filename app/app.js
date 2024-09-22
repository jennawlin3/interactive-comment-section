const commentContainer = document.querySelector(".comments-container");
let commentsArray = [];
let newCommentId = [];
let found = false;
let foundDelete = false;
let count = 0;
let comment = [];
let likes = [];
let dislikes = [];
let jsonArray = [];
let newComment = false;
let editReplyBool = false;

document.addEventListener("DOMContentLoaded", loadComments());

async function loadComments() {
    await fetch("./data.json")
    .then(response => response.json())
    .then(data => createApp(data));

    function createApp(data) {
    let dataArray = Object.entries(data);

    let currentUser = data.currentUser.username;

    // CREATE CURRENT USER TEXTAREA
    const newCommentContainer = document.createElement("section");
    newCommentContainer.classList.add("new-comment_container");
    const textareaComment = document.createElement("textarea");
    textareaComment.classList.add("new-comment");
    textareaComment.setAttribute("placeholder", "Add a comment...");
    const userOptions = document.createElement("div");
    userOptions.classList.add("user-options");
    const userAvatar = document.createElement("img");
    userAvatar.setAttribute("src", data.currentUser.image.webp);
    userAvatar.setAttribute("alt", data.currentUser.username);
    userAvatar.classList.add("user-avatar");
    const sendBtn = document.createElement("button");
    sendBtn.classList.add("send-btn");
    sendBtn.textContent = "Send";
    
    userOptions.appendChild(userAvatar);
    userOptions.appendChild(sendBtn);
    newCommentContainer.appendChild(textareaComment);
    newCommentContainer.appendChild(userOptions);
    commentContainer.appendChild(newCommentContainer);

    //CREATE COMMENTS
    let comments = dataArray[1][1];
    comments.forEach((c,i) => {

        // COMMENT DIV
        const commentCont = document.createElement("div");
        commentCont.classList.add("comment-cont");
        commentCont.setAttribute("data-id", c.id);

        const comment = document.createElement("article");
        comment.classList.add("comment");
        comment.setAttribute("id", c.id);

        // Comment information
        const commentInfo = document.createElement("div");
        commentInfo.classList.add("comment-info");

        const userAvatar = document.createElement("img");
        userAvatar.classList.add("user-avatar");
        userAvatar.setAttribute("src", c.user.image.webp);
        userAvatar.setAttribute("alt", c.user.username + " avatar");
        
        const username = document.createElement("a");
        username.classList.add("Username");
        username.textContent = c.user.username;

        const timestamp = document.createElement("p");
        timestamp.classList.add("timestamp");
        timestamp.textContent = c.createdAt;
        if(c.user.username === currentUser) {
            const yourUser = document.createElement("span");
            yourUser.classList.add("your-username");
            yourUser.textContent = "you";
            commentInfo.appendChild(userAvatar);
            commentInfo.appendChild(username);
            commentInfo.appendChild(yourUser);
            commentInfo.appendChild(timestamp);
        } else {
            commentInfo.appendChild(userAvatar);
            commentInfo.appendChild(username);
            commentInfo.appendChild(timestamp);
        }
        
        comment.appendChild(commentInfo);

        // Comment content
        const commentContent = document.createElement("p");
        commentContent.classList.add("comment-content");
        commentContent.textContent = c.content;
        comment.appendChild(commentContent);

        // Comments options 
        const commentOptions = document.createElement("div");
        commentOptions.classList.add("comment-options");
        const commentPoints = document.createElement("div");
        commentPoints.classList.add("comment-points");
        //More Btn
        const moreBtn = document.createElement("button");
        moreBtn.classList.add("more-btn");
        moreBtn.setAttribute("data-id", c.id);
        const moreIcon = document.createElement("i");
        moreIcon.classList.add("fa-solid");
        moreIcon.classList.add("fa-plus");
        moreBtn.appendChild(moreIcon);
        // Points
        const points = document.createElement("span");
        points.classList.add("points");
        points.textContent = c.score;
        points.setAttribute("data-id", c.id);

        //Minus Btn
        const minusBtn = document.createElement("button");
        minusBtn.classList.add("minus-btn");
        minusBtn.setAttribute("data-id", c.id);
        const minusIcon = document.createElement("i");
        minusIcon.classList.add("fa-solid");
        minusIcon.classList.add("fa-minus");
        minusBtn.appendChild(minusIcon);

        // Reply button Or User Options
                if(c.user.username === currentUser) {
                    const yourOptions = document.createElement("div");
                    yourOptions.classList.add("your-options");
                    //Delete Btn
                    const deleteBtnUser = document.createElement("button");
                    deleteBtnUser.classList.add("delete-btn");
                    deleteBtnUser.setAttribute("data-id", c.id);
                    const deleteBtnUserIcon = document.createElement("i");
                    deleteBtnUserIcon.classList.add("fa-solid");
                    deleteBtnUserIcon.classList.add("fa-trash");
                    deleteBtnUser.textContent = "Delete";
                    //Edit Btn
                    const editBtn = document.createElement("button");
                    editBtn.classList.add("edit-btn");
                    editBtn.setAttribute("data-id", c.id);
                    const editBtnIcon = document.createElement("i");
                    editBtnIcon.classList.add("fa-solid");
                    editBtnIcon.classList.add("fa-pen");
                    editBtn.textContent = "Edit";
                    
                    deleteBtnUser.appendChild(deleteBtnUserIcon);
                    editBtn.appendChild(editBtnIcon);
                    yourOptions.appendChild(deleteBtnUser);
                    yourOptions.appendChild(editBtn);

                    commentPoints.appendChild(moreBtn);
                    commentPoints.appendChild(points);
                    commentPoints.appendChild(minusBtn);
                    commentOptions.appendChild(commentPoints);
                    commentOptions.appendChild(yourOptions);
                    comment.appendChild(commentOptions);
                } else {
                    const replyBtn = document.createElement("button");
                    replyBtn.classList.add("reply-btn");
                    replyBtn.setAttribute("data-id", c.id);
                    replyBtn.textContent = "Reply";
                    const replyIcon = document.createElement("i");
                    replyIcon.classList.add("fa-solid");
                    replyIcon.classList.add("fa-reply");
                    replyBtn.appendChild(replyIcon);
                    
                    commentPoints.appendChild(moreBtn);
                    commentPoints.appendChild(points);
                    commentPoints.appendChild(minusBtn);
                    commentOptions.appendChild(commentPoints);
                    commentOptions.appendChild(replyBtn);
                    comment.appendChild(commentOptions);
                }
        commentCont.appendChild(comment)
        commentContainer.appendChild(commentCont);

        count = c.id;
        
        if(c.replies.length > 0) {
            let commentID = c.id;
            const commentDiv = document.querySelectorAll(".comment-cont");

            let commentWithReplies;

            commentDiv.forEach(div => {
                if(div.getAttribute("data-id") === String(commentID)) {
                    commentWithReplies = div;
                }
            })

            c.replies.forEach(r => {
                let countReply = r.id;

                const comment = document.createElement("article");
                comment.classList.add("reply");
                comment.setAttribute("id", r.id);

                // Comment information
                const commentInfo = document.createElement("div");
                commentInfo.classList.add("comment-info");
        
                const userAvatar = document.createElement("img");
                userAvatar.classList.add("user-avatar");
                userAvatar.setAttribute("src", r.user.image.webp);
                userAvatar.setAttribute("alt", r.user.username + " avatar");
                
                const username = document.createElement("a");
                username.classList.add("Username");
                username.textContent = r.user.username;
        
                const timestamp = document.createElement("p");
                timestamp.classList.add("timestamp");
                timestamp.textContent = r.createdAt;
                if(r.user.username === currentUser) {
                    const yourUser = document.createElement("span");
                    yourUser.classList.add("your-username");
                    yourUser.textContent = "you";
                    commentInfo.appendChild(userAvatar);
                    commentInfo.appendChild(username);
                    commentInfo.appendChild(yourUser);
                    commentInfo.appendChild(timestamp);
                } else {
                    commentInfo.appendChild(userAvatar);
                    commentInfo.appendChild(username);
                    commentInfo.appendChild(timestamp);
                }
                
                comment.appendChild(commentInfo);
        
                // Comment content
                const commentContentContainer = document.createElement("div");
                commentContentContainer.classList.add("comment-content_container");
                const userReplyTo = document.createElement("a");
                userReplyTo.setAttribute("href", "#")
                userReplyTo.classList.add("user-reply_to");
                userReplyTo.textContent = "@" + r.replyingTo;
                const commentContent = document.createElement("span");
                commentContent.classList.add("comment-content");
                commentContent.textContent = " " + r.content;
                commentContentContainer.appendChild(userReplyTo);
                commentContentContainer.appendChild(commentContent);
                comment.appendChild (commentContentContainer);
        
                // Comments options 
                const commentOptions = document.createElement("div");
                commentOptions.classList.add("comment-options");
                const commentPoints = document.createElement("div");
                commentPoints.classList.add("comment-points");
                //More Btn
                const moreBtn = document.createElement("button");
                moreBtn.classList.add("more-btn");
                moreBtn.setAttribute("data-id", r.id);
                const moreIcon = document.createElement("i");
                moreIcon.classList.add("fa-solid");
                moreIcon.classList.add("fa-plus");
                moreBtn.appendChild(moreIcon);
                // Points
                const points = document.createElement("span");
                points.classList.add("points");
                points.textContent = r.score;
                points.setAttribute("data-id", r.id);
        
                //Minus Btn
                const minusBtn = document.createElement("button");
                minusBtn.classList.add("minus-btn");
                minusBtn.setAttribute("data-id", r.id);
                const minusIcon = document.createElement("i");
                minusIcon.classList.add("fa-solid");
                minusIcon.classList.add("fa-minus");
                minusBtn.appendChild(minusIcon);
        
                // Reply button Or User Options
                if(r.user.username === currentUser) {
                    const yourOptions = document.createElement("div");
                    yourOptions.classList.add("your-options");
                    //Delete Btn
                    const deleteBtnUser = document.createElement("button");
                    deleteBtnUser.classList.add("delete-btn");
                    deleteBtnUser.setAttribute("data-id", r.id);
                    const deleteBtnUserIcon = document.createElement("i");
                    deleteBtnUserIcon.classList.add("fa-solid");
                    deleteBtnUserIcon.classList.add("fa-trash");
                    deleteBtnUser.textContent = "Delete";
                    //Edit Btn
                    const editBtn = document.createElement("button");
                    editBtn.classList.add("edit-btn");
                    editBtn.setAttribute("data-id", r.id);
                    const editBtnIcon = document.createElement("i");
                    editBtnIcon.classList.add("fa-solid");
                    editBtnIcon.classList.add("fa-pen");
                    editBtn.textContent = "Edit";
                    
                    deleteBtnUser.appendChild(deleteBtnUserIcon);
                    editBtn.appendChild(editBtnIcon);
                    yourOptions.appendChild(deleteBtnUser);
                    yourOptions.appendChild(editBtn);

                    commentPoints.appendChild(moreBtn);
                    commentPoints.appendChild(points);
                    commentPoints.appendChild(minusBtn);
                    commentOptions.appendChild(commentPoints);
                    commentOptions.appendChild(yourOptions);
                    comment.appendChild(commentOptions);
                } else {
                    const replyBtn = document.createElement("button");
                    replyBtn.classList.add("reply-btn");
                    replyBtn.setAttribute("data-id", r.id);
                    replyBtn.textContent = "Reply";
                    const replyIcon = document.createElement("i");
                    replyIcon.classList.add("fa-solid");
                    replyIcon.classList.add("fa-reply");
                    replyBtn.appendChild(replyIcon);
                    
                    commentPoints.appendChild(moreBtn);
                    commentPoints.appendChild(points);
                    commentPoints.appendChild(minusBtn);
                    commentOptions.appendChild(commentPoints);
                    commentOptions.appendChild(replyBtn);
                    comment.appendChild(commentOptions);
                }
                
                commentWithReplies.appendChild(comment);
                
                if(countReply > count) {
                    count = countReply;
                }
             })
            }
        });

        jsonArray = dataArray;
    loadFunctionality(dataArray, data);
    }
}

function loadFunctionality(dataArray, data) {
    const replyBtns = document.querySelectorAll(".reply-btn");
    const newCommentContainer = document.querySelector(".new-comment_container");

    //Comments
    const moreBtns = document.querySelectorAll(".comment .comment-options .comment-points .more-btn");
    const minusBtns = document.querySelectorAll(".comment .comment-options .comment-points .minus-btn");
    const deleteBtns = document.querySelectorAll(".comment .comment-options .your-options .delete-btn");
    const sendBtn = document.querySelectorAll(".send-btn");
    const editBtns = document.querySelectorAll(".comment .comment-options .your-options .edit-btn");

    //Replies
    const moreReplyBtns = document.querySelectorAll(".reply .comment-options .comment-points .more-btn");
    const minusReplyBtns = document.querySelectorAll(".reply .comment-options .comment-points .minus-btn");
    const deleteReplyBtns = document.querySelectorAll(".reply .comment-options .your-options .delete-btn");
    const editReplyBtns = document.querySelectorAll(".reply .comment-options .your-options .edit-btn");
    let commentText;

    moreBtns.forEach((btn) => {
        btn.addEventListener("click", e => {
            e.stopPropagation();
            if(e.currentTarget) {
                let id = e.currentTarget.getAttribute("data-id");
                //console.log(id);
                addPoints(dataArray, id);
            }
        }
        )
    });

    moreReplyBtns.forEach((btn) => {
        btn.addEventListener("click", e => {
            e.stopPropagation();
            if(e.currentTarget) {
                let id = e.currentTarget.getAttribute("data-id");
                //console.log(id);
                repliesMorePoints(dataArray, id);
            }
        }
        )
    });

    minusBtns.forEach((btn) => {
        btn.addEventListener("click", e => {
            if(e) {
                let id = e.currentTarget.getAttribute("data-id");
                removePoints(dataArray, id);
                //console.log(id);
            }
        }
        )
    });

    minusReplyBtns.forEach((btn) => {
        btn.addEventListener("click", e => {
            if(e) {
                let id = e.currentTarget.getAttribute("data-id");
                repliesMinusPoints(dataArray, id);
                //console.log(id);
            }
        }
        )
    });

    replyBtns.forEach((btn) => {
        btn.addEventListener("click", e => {
            if(e) {
                let id = btn.getAttribute("data-id");
                //console.log(id);
                addNewComment(data, id);
            }
        })
    });

    deleteBtns.forEach((btn) => {
        btn.addEventListener("click", e => {
            if(e) {
                let id = btn.getAttribute("data-id");
                const overlay = document.querySelector(".overlay");
                const confirmModal = document.querySelector(".confirm-modal");
                const confirm = document.querySelector(".confirm");
                const cancel = document.querySelector(".cancel");

                overlay.classList.remove("hide");
                confirmModal.classList.remove("hide");

                confirm.addEventListener("click", e => {
                    if(e) {
                        let response = true;
                        deleteComment(data, id, response);
                    }
                });

                cancel.addEventListener("click", e => {
                    if(e) {
                overlay.classList.add("hide");
                confirmModal.classList.add("hide");
                return;
                    }
                })
            }
        })
    });

    deleteReplyBtns.forEach((btn) => {
        btn.addEventListener("click", e => {
            if(e) {;
                let id = btn.getAttribute("data-id");
                const overlay = document.querySelector(".overlay");
                const confirmModal = document.querySelector(".confirm-modal");
                const confirm = document.querySelector(".confirm");
                const cancel = document.querySelector(".cancel");

                overlay.classList.remove("hide");
                confirmModal.classList.remove("hide");

                confirm.addEventListener("click", e => {
                    if(e) {
                        overlay.classList.add("hide");
                        confirmModal.classList.add("hide");
                        deleteReply(data, id);
                    }
                });

                cancel.addEventListener("click", e => {
                    if(e) {
                overlay.classList.add("hide");
                confirmModal.classList.add("hide");
                return;
                    }
                })       
            }
        })
    });

    editReplyBtns.forEach((btn) => {
        btn.addEventListener("click", e => {
            if(e) {
                let id = btn.getAttribute("data-id");
                editReply(data, id);
                console.log("hola");        
            }
         });     
    })

    editBtns.forEach((btn) => {
        btn.addEventListener("click", e => {
            if(e) {
                let id = btn.getAttribute("data-id");
                editComment(data, id);        
            }
         })
    });

    newCommentContainer.addEventListener("click", e => {
        if(e) {
            newComment = false;
        }
    })

    newCommentContainer.addEventListener("keyup", e => {
            commentText = e.target.value;
    })

    sendBtn.forEach((btn) => {
        btn.addEventListener("click", e => {
            if(e) {
            const newComment = document.querySelector(".new-comment_container");
            const sendCommentCont = document.querySelector(".new-comment_container .user-options .send-btn");
            newComment.setAttribute("data-id", count);
            sendCommentCont.setAttribute("data-id", count);
            count++;
            sendComment(dataArray, commentText, data);                
            }
        })
    });
}

// ADD POINTS - COMMENTS
function addPoints(dataArray, id) {
    let comments = dataArray[1][1];
    const pointsSpan = document.querySelectorAll(".points");
    let pointSpan;    
    let number;

    if (likes.indexOf(id) !== -1) {
        //console.log(likes);
        return;
    }    
    if (dislikes.indexOf(id) !== -1) {
        dislikes = dislikes.filter(item => item !== id)
    }
    
    //console.log(dislikes, likes);
    
    pointsSpan.forEach(p => {
        if(p.getAttribute("data-id") === id) {
            pointSpan = p;
            number = Number(pointSpan.textContent);
        }
    })

    number++;
    pointSpan.textContent = number;
    likes.push(id);
    
    comments.forEach((c, i) => {
        //console.log(comments);
        if(c.id === Number(id)) {
            pointSpan.textContent = number;
            c.score = Number(number);
            //console.log(c);
            return;           
        }
    })
    //console.log(dataArray);
}

// REMOVE POINTS - COMMENTS
function removePoints(dataArray, id) {
    let comments = dataArray[1][1];
    const pointsSpan = document.querySelectorAll(".points");    
    let pointSpan;
    let number;
    
    if (likes.indexOf(id) !== -1) {
        likes = likes.filter(item => item !== id)
    } 
    if (dislikes.indexOf(id) !== -1) {
        return;
    }
    
    //console.log(dislikes, likes);

    pointsSpan.forEach(p => {
        if(p.getAttribute("data-id") === id) {
            pointSpan = p;
            number = Number(pointSpan.textContent);
        }
    })

    if(number === 0) {
        return
    }
    number--;
    pointSpan.textContent = number;
    dislikes.push(id);

    comments.forEach((c, i) => {
        if(c.id === Number(id)) {
            pointSpan.textContent = number;
            c.score = number;
            //console.log(c); 
            return;    
            }
    })
}

// ADD MORE POINTS - REPLIES
function repliesMorePoints(dataArray, id) {
    //console.log(id);
    let comments = dataArray[1][1];
    const pointsSpan = document.querySelectorAll(".points");    
    let pointSpan;
    let number;
    if (likes.indexOf(id) !== -1) {
        return;
    }    
    if (dislikes.indexOf(id) !== -1) {
        dislikes = dislikes.filter(item => item !== id)
    }
    
    pointsSpan.forEach(p => {
        if(p.getAttribute("data-id") === id) {
            pointSpan = p;
            number = Number(pointSpan.textContent);
        }
    });

    number++;
    pointSpan.textContent = number;
    likes.push(id);
    //console.log(dataArray)

    comments.forEach((c, i) => {
        if(c.replies) {
            //console.log(c.replies);
            c.replies.forEach((r,i) => {
                if(r.id === Number(id)) {
                    r.score = number;
                    //console.log(r);
                    return;
                }
            });
        }
    });
}

// REMOVE POINTS - REPLIES
function repliesMinusPoints(dataArray, id) {
    if (likes.indexOf(id) !== -1) {
        likes = likes.filter(item => item !== id)
    } 
    if (dislikes.indexOf(id) !== -1) {
        return;
    }

    let comments = dataArray[1][1];
    const pointsSpan = document.querySelectorAll(".points");    
    let pointSpan;
    let number;

    pointsSpan.forEach(p => {
        if(p.getAttribute("data-id") === id) {
            pointSpan = p;
            number = Number(pointSpan.textContent);
            // console.log(p, number);
        }
    })


    if(number === 0) {
        return
    }
    number--;
    pointSpan.textContent = number;
    dislikes.push(id);

    comments.forEach((c, i) => {
        if(c.replies) {
            c.replies.forEach((r,i) => {
''
                if(r.id === Number(id)) {
                    pointSpan.textContent = number;
                    r.score = number;              
                    //console.log(r);
                    return; 
                    //}
                }
            })
        }
    });
}

// ADD TEXTAREA OF NEW COMMENT
function addNewComment(data, id) {
    let commentContainer = document.querySelectorAll(".comments-container article");
    let idComment;
    let comment;

    commentContainer.forEach(c => {
        if(c.getAttribute("id") === id) {
            idComment = c.getAttribute("id");
            comment = c;
        }
    })

    const userRepliyingTo = comment.childNodes[0].childNodes[1].textContent;
    let userReplyLenght = userRepliyingTo.length;

    count++;

    if(newCommentId.indexOf(id) !== -1) {
        return
    } else {
    const newCommentContainer = document.createElement("section");
    newCommentContainer.classList.add("reply-comment_container");
    newCommentContainer.setAttribute("data-id", count);
    const textareaComment = document.createElement("textarea");
    textareaComment.classList.add("new-comment");
    textareaComment.textContent = "@" + userRepliyingTo;
    const userOptions = document.createElement("div");
    userOptions.classList.add("user-options");
    const userAvatar = document.createElement("img");
    userAvatar.setAttribute("src", data.currentUser.image.webp);
    userAvatar.setAttribute("alt", data.currentUser.username);
    userAvatar.classList.add("user-avatar");
    const sendBtn = document.createElement("button");
    sendBtn.classList.add("send-btn");
    sendBtn.setAttribute("data-id", count);
    sendBtn.textContent = "Reply";
    
    userOptions.appendChild(userAvatar);
    userOptions.appendChild(sendBtn);
    newCommentContainer.appendChild(textareaComment);
    newCommentContainer.appendChild(userOptions);
    comment.after(newCommentContainer);
    newCommentId.push(id);         
    }
    const sendBtn = document.querySelectorAll(".send-btn");
    let idCount = count;
    const textareas = document.querySelectorAll(".new-comment");
    let textareaVal;
    let username = data.currentUser.username;
    let usernamePic = data.currentUser.image.webp;

    textareas.forEach(t => {
        t.addEventListener("keyup", e => {
            textareaVal = e.target.value;
            //console.log(textareaVal);
        })
    })

    sendBtn.forEach((btn) => {
        btn.addEventListener("click", e => {
            e.stopPropagation();
            if(e) {  
            sendReply(userReplyLenght, idCount, textareaVal, username, usernamePic, userRepliyingTo, idComment, data);
            }
        })        
    })
}

// DELETE COMMENT
function deleteComment(data, id) {
    const overlay = document.querySelector(".overlay");
    const confirmModal = document.querySelector(".confirm-modal");
    overlay.classList.add("hide");
    confirmModal.classList.add("hide");

    let comments = data.comments;
    const commentsContainer = document.querySelector(".comments-container");
    const commentContainer = document.querySelectorAll(".comment-cont");
    //console.log(id);

    comments.forEach((d) => {
        //console.log(d);
        if(d.id === Number(id)) {
            //console.log(id);
            delete d.id;
            delete d.content;
            delete d.createdAt;
            delete d.score;
            delete d.user;
            delete d.replies;
            
            commentContainer.forEach(commentCont => {
                if(commentCont.getAttribute("data-id") === id) {
                //console.log(commentCont);
                commentsContainer.removeChild(commentCont);
                return;
                }
            })
        }       
    })
}

// DELETE REPLY
function deleteReply(data, id) {
    let comments = data.comments;
    const commentContainer = document.querySelectorAll(".comment-cont");
    let replyId = id;

    comments.forEach((d) => {
        if(d.replies) {
            d.replies.forEach((r) => {
            if(r.id === Number(id)) {
                delete r.id;
                delete r.content;
                delete r.createdAt;
                delete r.score;
                delete r.user;
                delete r.replies;
                delete r.replyingTo;    
            
            //console.log(r);
            commentContainer.forEach(commentCont => {
                if(commentCont.childNodes.length > 1) {
                    let replies = commentCont.childNodes;
                    replyId = commentCont.getAttribute("data-id");

                    replies.forEach(r => {
                        //console.log(typeof r.getAttribute("id"));
                        //console.log(typeof id);
                        if(r.getAttribute("id") === id) {
                            //console.log(r);
                            commentCont.removeChild(r);
                                }
                            })
                        }
                    })
                }       
            })
        }
    })
}

// EDIT COMMENT
function editComment(data, id) {
    let commentsContainer = document.querySelector(".comments-container");
    const commentContainer = document.querySelectorAll(".comment-cont");
    const comments = document.querySelectorAll(".comment-cont article");
    let comment;

    let dataArray = Object.entries(data);

    comments.forEach(c => {
        //console.log(c);
        if(c.getAttribute("id") === id) {
            idComment = c.getAttribute("id");
            comment = c;
            c.classList.add("hide");
            
        }
    })

    let textComment = comment.childNodes[1].textContent;

    const newCommentContainer = document.createElement("div");
    newCommentContainer.classList.add("edit-comment_container");
    newCommentContainer.setAttribute("data-id", id);
    const textareaComment = document.createElement("textarea");
    textareaComment.classList.add("edit-comment");
    textareaComment.textContent = textComment;
    const userOptions = document.createElement("div");
    userOptions.classList.add("user-options");
    const userAvatar = document.createElement("img");
    userAvatar.setAttribute("src", data.currentUser.image.webp);
    userAvatar.setAttribute("alt", data.currentUser.username);
    userAvatar.classList.add("user-avatar");
    const sendBtn = document.createElement("button");
    sendBtn.classList.add("send-btn");
    sendBtn.setAttribute("data-id", id);
    sendBtn.textContent = "Update";
    
    userOptions.appendChild(userAvatar);
    userOptions.appendChild(sendBtn);
    newCommentContainer.appendChild(textareaComment);
    newCommentContainer.appendChild(userOptions);
    commentsContainer.appendChild(newCommentContainer);      

    const sendBtnEdit = document.querySelectorAll(".send-btn");
    //console.log(sendBtnEdit);
    const textareas = document.querySelectorAll(".edit-comment");
    let textareaVal = textComment;
    //console.log(textareaVal);
    let username = data.currentUser.username;
    let usernamePic = data.currentUser.image.webp;

    textareas.forEach(t => {
        t.addEventListener("keyup", e => {
            textareaVal = e.target.value;
            //console.log(textareaVal);
        })
    })

    sendBtnEdit.forEach((btn) => {
        if(btn.getAttribute("data-id") === String(id)) {
        //console.log(btn);
        btn.addEventListener("click", e => {  
            if(e) {
            //console.log(textareaVal);  
            updateComment(id, textareaVal, dataArray, data);
                }                        
            })     
        }
    }) 
}

// UPDATE COMMENT 
function updateComment(id, textareaVal, dataArray, data) {
    if(textareaVal === undefined) {
        return;
    }

    let currentUser = dataArray[0][1];
    const commentSection = document.querySelector(".comments-container");
    const elementsComment = document.querySelectorAll(".comments-container div");    
    const commentJSON = dataArray[1][1];
    let currentUserInfo;

    elementsComment.forEach(c => {
        //console.log(c);
        if(c.getAttribute("data-id") === id) {
            commentSection.removeChild(c);
        }
    });

    commentJSON.forEach(cj => {
        //console.log(cj);
        if(cj.id === Number(id)) {
            currentUserInfo = cj;
            cj.content = textareaVal;
        }
    })

    // Create new comment    
    const commentCont = document.createElement("div");
    commentCont.classList.add("comment-cont");
    commentCont.setAttribute("data-id", id);
    const comment = document.createElement("article");
    comment.classList.add("comment");
    comment.setAttribute("id", id);
    
    // Comment information
    const commentInfo = document.createElement("div");
    commentInfo.classList.add("comment-info");
        
    const userAvatar = document.createElement("img");
    userAvatar.classList.add("user-avatar");
    userAvatar.setAttribute("src", currentUser.image.webp);
    userAvatar.setAttribute("alt", currentUser.username + " avatar");
                
    const username = document.createElement("a");
    username.classList.add("Username");
    username.textContent = currentUser.username;
        
    const timestamp = document.createElement("p");
    timestamp.classList.add("timestamp");
    timestamp.textContent = "now";

        const yourUser = document.createElement("span");
        yourUser.classList.add("your-username");
        yourUser.textContent = "you";
        commentInfo.appendChild(userAvatar);
        commentInfo.appendChild(username);
        commentInfo.appendChild(yourUser);
        commentInfo.appendChild(timestamp);
                
    comment.appendChild(commentInfo);
        
    // Comment content
    const commentContentContainer = document.createElement("div");
    commentContentContainer.classList.add("comment-content");
    const commentContent = document.createElement("span");
    commentContent.classList.add("comment-content");
    commentContent.textContent = " " + textareaVal;
    commentContentContainer.appendChild(commentContent);
    comment.appendChild (commentContentContainer);
        
    // Comments options 
    const commentOptions = document.createElement("div");
    commentOptions.classList.add("comment-options");
    const commentPoints = document.createElement("div");
    commentPoints.classList.add("comment-points");
    //More Btn
    const moreBtn = document.createElement("button");
    moreBtn.classList.add("more-btn");
    moreBtn.setAttribute("data-id", id);
    const moreIcon = document.createElement("i");
    moreIcon.classList.add("fa-solid");
    moreIcon.classList.add("fa-plus");
    moreBtn.appendChild(moreIcon);
    // Points
    const points = document.createElement("span");
    points.classList.add("points");
    points.textContent = currentUserInfo.score;
    points.setAttribute("data-id", id);
        
    //Minus Btn
    const minusBtn = document.createElement("button");
    minusBtn.classList.add("minus-btn");
    minusBtn.setAttribute("data-id", id);
    const minusIcon = document.createElement("i");
    minusIcon.classList.add("fa-solid");
    minusIcon.classList.add("fa-minus");
    minusBtn.appendChild(minusIcon);
        
    // Reply button Or User Options
    const yourOptions = document.createElement("div");
    yourOptions.classList.add("your-options");
    //Delete Btn
    const deleteBtnUser = document.createElement("button");
    deleteBtnUser.classList.add("delete-btn");
    deleteBtnUser.setAttribute("data-id", id);
    const deleteBtnUserIcon = document.createElement("i");
    deleteBtnUserIcon.classList.add("fa-solid");
    deleteBtnUserIcon.classList.add("fa-trash");
    deleteBtnUser.textContent = "Delete";
    //Edit Btn
    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-btn");
    editBtn.setAttribute("data-id", id);
    const editBtnIcon = document.createElement("i");
    editBtnIcon.classList.add("fa-solid");
    editBtnIcon.classList.add("fa-pen");
    editBtn.textContent = "Edit";
    editBtn.setAttribute("data-id", id);
                    
    deleteBtnUser.appendChild(deleteBtnUserIcon);
    editBtn.appendChild(editBtnIcon);
    yourOptions.appendChild(deleteBtnUser);
    yourOptions.appendChild(editBtn);

    commentPoints.appendChild(moreBtn);
    commentPoints.appendChild(points);
    commentPoints.appendChild(minusBtn);
    commentOptions.appendChild(commentPoints);
    commentOptions.appendChild(yourOptions);
    comment.appendChild(commentOptions);
    commentCont.appendChild(comment);
    commentSection.appendChild(commentCont);

    console.log(dataArray);

    loadFunctionality(dataArray, data);
    return;
}

// EDIT REPLY
function editReply(data, id) {
    if(editReplyBool === true) {
        return;
    }

    let commentsContainer = document.querySelector(".comments-container");
    const commentContainer = document.querySelectorAll(".comment-cont");
    const comments = document.querySelectorAll(".comment-cont article");
    let reply;

    let dataArray = Object.entries(data);

    commentContainer.forEach(c => {
       //console.log(c.childNodes);
       c.childNodes.forEach(cc => {
        if(cc.getAttribute("id") === id) {
            idComment = c.getAttribute("data-id");
            idReply = cc.getAttribute("id");
            reply = cc;
            cc.classList.add("hide");
        }     
       })
    })

    let textComment = reply.childNodes[1].textContent;
    console.log(textComment);

    const newCommentContainer = document.createElement("article");
    newCommentContainer.classList.add("edit-reply_container");
    newCommentContainer.setAttribute("data-id", id);
    const textareaComment = document.createElement("textarea");
    textareaComment.classList.add("edit-comment");
    textareaComment.textContent = textComment;
    const userOptions = document.createElement("div");
    userOptions.classList.add("user-options");
    const userAvatar = document.createElement("img");
    userAvatar.setAttribute("src", data.currentUser.image.webp);
    userAvatar.setAttribute("alt", data.currentUser.username);
    userAvatar.classList.add("user-avatar");
    const sendBtn = document.createElement("button");
    sendBtn.classList.add("send-btn");
    sendBtn.setAttribute("data-id", id);
    sendBtn.textContent = "Update";
    
    userOptions.appendChild(userAvatar);
    userOptions.appendChild(sendBtn);
    newCommentContainer.appendChild(textareaComment);
    newCommentContainer.appendChild(userOptions);
    commentContainer[idComment-1].appendChild(newCommentContainer);      

    const sendBtnEdit = document.querySelectorAll(".send-btn");
    //console.log(sendBtnEdit);
    const textareas = document.querySelectorAll(".edit-comment");
    let textareaVal = textComment;

    textareas.forEach(t => {
        t.addEventListener("keyup", e => {
            textareaVal = e.target.value;
            console.log(textareaVal);
        })
    })

    sendBtnEdit.forEach((btn) => {
        if(btn.getAttribute("data-id") === String(id)) {
        btn.addEventListener("click", e => {  
            if(e) {
            let idReply = btn.getAttribute("data-id");  
            updateReply(idReply, idComment, textareaVal, dataArray, data);
            editReplyBool = false;
                }                        
            })     
        }
    }) 
    editReplyBool = true;
}

// UPDATE REPLY
function updateReply(idReply, idComment, textareaVal, dataArray, data) {
    if(textareaVal === undefined) {
        return;
    }

    let currentUser = dataArray[0][1];
    const commentSection = document.querySelectorAll(".comment-cont");
    const elementsComment = document.querySelectorAll(".comment-cont article");    
    const commentJSON = dataArray[1][1];
    let currentUserInfo;

    
    elementsComment.forEach(c => {
        console.log(c);
        if(c.getAttribute("data-id") === idReply || c.getAttribute("id") === idReply) {
            commentSection[idComment-1].removeChild(c);
        }
    });

    commentJSON.forEach(cj => {
        console.log(cj);
        if(cj.replies.length > 0) {
            cj.replies.forEach(r => {      
                if(r.id === Number(idReply)) {
                currentUserInfo = r;
                r.content = textareaVal;
        }
            })
        }

    })

    let text = textareaVal.split(" ");
    let userReply = text.filter(word => word.includes("@")).join();
    let userReplyLenght = userReply.length;
    textareaVal = textareaVal.substring(userReplyLenght, textareaVal.length+1);

    // Create new comment    
    const commentCont = document.createElement("div");
    commentCont.classList.add("comment-cont");
    commentCont.setAttribute("data-id", idReply);
    const comment = document.createElement("article");
    comment.classList.add("reply");
    comment.setAttribute("id", idReply);
    
    // Comment information
    const commentInfo = document.createElement("div");
    commentInfo.classList.add("comment-info");
        
    const userAvatar = document.createElement("img");
    userAvatar.classList.add("user-avatar");
    userAvatar.setAttribute("src", currentUser.image.webp);
    userAvatar.setAttribute("alt", currentUser.username + " avatar");
                
    const username = document.createElement("a");
    username.classList.add("Username");
    username.textContent = currentUser.username;
        
    const timestamp = document.createElement("p");
    timestamp.classList.add("timestamp");
    timestamp.textContent = "now";

        const yourUser = document.createElement("span");
        yourUser.classList.add("your-username");
        yourUser.textContent = "you";
        commentInfo.appendChild(userAvatar);
        commentInfo.appendChild(username);
        commentInfo.appendChild(yourUser);
        commentInfo.appendChild(timestamp);
                
    comment.appendChild(commentInfo);
        
    // Comment content
    const commentContentContainer = document.createElement("div");
    commentContentContainer.classList.add("comment-content_container");
    const userReplyTo = document.createElement("a");
    userReplyTo.setAttribute("href", "#")
    userReplyTo.classList.add("user-reply_to");
    userReplyTo.textContent = userReply;
    const commentContent = document.createElement("span");
    commentContent.classList.add("comment-content");
    commentContent.textContent = " " + textareaVal;
    commentContentContainer.appendChild(userReplyTo);
    commentContentContainer.appendChild(commentContent);
    comment.appendChild (commentContentContainer);
        
    // Comments options 
    const commentOptions = document.createElement("div");
    commentOptions.classList.add("comment-options");
    const commentPoints = document.createElement("div");
    commentPoints.classList.add("comment-points");
    //More Btn
    const moreBtn = document.createElement("button");
    moreBtn.classList.add("more-btn");
    moreBtn.setAttribute("data-id", idReply);
    const moreIcon = document.createElement("i");
    moreIcon.classList.add("fa-solid");
    moreIcon.classList.add("fa-plus");
    moreBtn.appendChild(moreIcon);
    // Points
    const points = document.createElement("span");
    points.classList.add("points");
    points.textContent = currentUserInfo.score;
    points.setAttribute("data-id", idReply);
        
    //Minus Btn
    const minusBtn = document.createElement("button");
    minusBtn.classList.add("minus-btn");
    minusBtn.setAttribute("data-id", idReply);
    const minusIcon = document.createElement("i");
    minusIcon.classList.add("fa-solid");
    minusIcon.classList.add("fa-minus");
    minusBtn.appendChild(minusIcon);
        
    // Reply button Or User Options
    const yourOptions = document.createElement("div");
    yourOptions.classList.add("your-options");
    //Delete Btn
    const deleteBtnUser = document.createElement("button");
    deleteBtnUser.classList.add("delete-btn");
    deleteBtnUser.setAttribute("data-id", idReply);
    const deleteBtnUserIcon = document.createElement("i");
    deleteBtnUserIcon.classList.add("fa-solid");
    deleteBtnUserIcon.classList.add("fa-trash");
    deleteBtnUser.textContent = "Delete";
    //Edit Btn
    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-btn");
    editBtn.setAttribute("data-id", idReply);
    const editBtnIcon = document.createElement("i");
    editBtnIcon.classList.add("fa-solid");
    editBtnIcon.classList.add("fa-pen");
    editBtn.textContent = "Edit";
    editBtn.setAttribute("data-id", idReply);
                    
    deleteBtnUser.appendChild(deleteBtnUserIcon);
    editBtn.appendChild(editBtnIcon);
    yourOptions.appendChild(deleteBtnUser);
    yourOptions.appendChild(editBtn);

    commentPoints.appendChild(moreBtn);
    commentPoints.appendChild(points);
    commentPoints.appendChild(minusBtn);
    commentOptions.appendChild(commentPoints);
    commentOptions.appendChild(yourOptions);
    comment.appendChild(commentOptions);
    commentSection[idComment-1].appendChild(comment);

    console.log(dataArray);

    loadFunctionality(dataArray, data);
    return;
}

// SEND COMMENT
function sendComment(dataArray, commentText, data) {
    if(commentText === undefined) {
        return;
    }

    let currentUser = dataArray[0][1];
    const commentContainer = document.querySelector(".new-comment_container");
    const commentSection = document.querySelector(".comments-container");
    const commentsContainer = document.querySelectorAll(".comment-cont");

    let text = commentText;
    let commentDivCont = commentContainer.getAttribute("data-id");

    if(newComment === true) {
        return;
    }

    // Create new comment    
    const commentCont = document.createElement("div");
    commentCont.classList.add("comment-cont");
    commentCont.setAttribute("data-id", commentDivCont);
    const comment = document.createElement("article");
    comment.classList.add("comment");
    comment.setAttribute("id", commentDivCont);
    
    // Comment information
    const commentInfo = document.createElement("div");
    commentInfo.classList.add("comment-info");
        
    const userAvatar = document.createElement("img");
    userAvatar.classList.add("user-avatar");
    userAvatar.setAttribute("src", currentUser.image.webp);
    userAvatar.setAttribute("alt", currentUser.username + " avatar");
                
    const username = document.createElement("a");
    username.classList.add("Username");
    username.textContent = currentUser.username;
        
    const timestamp = document.createElement("p");
    timestamp.classList.add("timestamp");
    timestamp.textContent = "now";

        const yourUser = document.createElement("span");
        yourUser.classList.add("your-username");
        yourUser.textContent = "you";
        commentInfo.appendChild(userAvatar);
        commentInfo.appendChild(username);
        commentInfo.appendChild(yourUser);
        commentInfo.appendChild(timestamp);
                
    comment.appendChild(commentInfo);
        
    // Comment content
    const commentContentContainer = document.createElement("div");
    commentContentContainer.classList.add("comment-content");
    const commentContent = document.createElement("span");
    commentContent.classList.add("comment-content");
    commentContent.textContent = " " + text;
    commentContentContainer.appendChild(commentContent);
    comment.appendChild (commentContentContainer);
        
    // Comments options 
    const commentOptions = document.createElement("div");
    commentOptions.classList.add("comment-options");
    const commentPoints = document.createElement("div");
    commentPoints.classList.add("comment-points");
    //More Btn
    const moreBtn = document.createElement("button");
    moreBtn.classList.add("more-btn");
    moreBtn.setAttribute("data-id", commentDivCont);
    const moreIcon = document.createElement("i");
    moreIcon.classList.add("fa-solid");
    moreIcon.classList.add("fa-plus");
    moreBtn.appendChild(moreIcon);
    // Points
    const points = document.createElement("span");
    points.classList.add("points");
    points.textContent = 0;
    points.setAttribute("data-id", commentDivCont);
        
    //Minus Btn
    const minusBtn = document.createElement("button");
    minusBtn.classList.add("minus-btn");
    minusBtn.setAttribute("data-id", commentDivCont);
    const minusIcon = document.createElement("i");
    minusIcon.classList.add("fa-solid");
    minusIcon.classList.add("fa-minus");
    minusBtn.appendChild(minusIcon);
        
    // Reply button Or User Options
    const yourOptions = document.createElement("div");
    yourOptions.classList.add("your-options");
    //Delete Btn
    const deleteBtnUser = document.createElement("button");
    deleteBtnUser.classList.add("delete-btn");
    deleteBtnUser.setAttribute("data-id", commentDivCont);
    const deleteBtnUserIcon = document.createElement("i");
    deleteBtnUserIcon.classList.add("fa-solid");
    deleteBtnUserIcon.classList.add("fa-trash");
    deleteBtnUser.textContent = "Delete";
    //Edit Btn
    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-btn");
    editBtn.setAttribute("data-id", count);
    const editBtnIcon = document.createElement("i");
    editBtnIcon.classList.add("fa-solid");
    editBtnIcon.classList.add("fa-pen");
    editBtn.textContent = "Edit";
    editBtn.setAttribute("data-id", commentDivCont);
                    
    deleteBtnUser.appendChild(deleteBtnUserIcon);
    editBtn.appendChild(editBtnIcon);
    yourOptions.appendChild(deleteBtnUser);
    yourOptions.appendChild(editBtn);

    commentPoints.appendChild(moreBtn);
    commentPoints.appendChild(points);
    commentPoints.appendChild(minusBtn);
    commentOptions.appendChild(commentPoints);
    commentOptions.appendChild(yourOptions);
    comment.appendChild(commentOptions);
    commentCont.appendChild(comment);
    commentSection.appendChild(commentCont);


    const objJSON = {
        content: text,
        createdAt: timestamp.textContent,
        id: Number(commentDivCont),
        score: 0,
        replies: [],
        user: {
            image: {
            webp: currentUser.image.webp,
            png: currentUser.image.png
            },
            username: currentUser.username,
        }
    }

    dataArray[1][1].push(objJSON);

    const textareaComment = document.querySelector(".new-comment");
    textareaComment.value = "";

    loadFunctionality(dataArray, data);
    newComment = true;
    return;
}

// SEND REPLY
function sendReply(length, idCount, textTextarea, user, usernamePic, userReply, idComment,data) {
    if(textTextarea === undefined) {
        return;
    }

    let dataArray = Object.entries(data);
    const commentsContainer = document.querySelectorAll(".comment-cont");
    const replyTextarea = document.querySelector(".reply-comment_container");

    let text = textTextarea.substring(length+1, textTextarea.length+1);
    let commentDivCont;

    commentsContainer.forEach(c => {
        let ct = c.childNodes;
        ct.forEach(cc => {
            if(cc.classList.contains("reply-comment_container")){
              commentDivCont = c.getAttribute("data-id"); 
              //console.log(typeof commentDivCont); 
            }
        })
    })

    // Create new comment
    const comment = document.createElement("article");
    comment.classList.add("reply");
    comment.setAttribute("id", idCount);
    
    // Comment information
    const commentInfo = document.createElement("div");
    commentInfo.classList.add("comment-info");
        
    const userAvatar = document.createElement("img");
    userAvatar.classList.add("user-avatar");
    userAvatar.setAttribute("src", usernamePic);
    userAvatar.setAttribute("alt", user + " avatar");
                
    const username = document.createElement("a");
    username.classList.add("Username");
    username.textContent = user;
        
    const timestamp = document.createElement("p");
    timestamp.classList.add("timestamp");
    timestamp.textContent = "now";

        const yourUser = document.createElement("span");
        yourUser.classList.add("your-username");
        yourUser.textContent = "you";
        commentInfo.appendChild(userAvatar);
        commentInfo.appendChild(username);
        commentInfo.appendChild(yourUser);
        commentInfo.appendChild(timestamp);
                
    comment.appendChild(commentInfo);
        
    // Comment content
    const commentContentContainer = document.createElement("div");
    commentContentContainer.classList.add("comment-content_container");
    const userReplyTo = document.createElement("a");
    userReplyTo.setAttribute("href", "#")
    userReplyTo.classList.add("user-reply_to");
    userReplyTo.textContent = "@" + userReply;
    const commentContent = document.createElement("span");
    commentContent.classList.add("comment-content");
    commentContent.textContent = " " + text;
    commentContentContainer.appendChild(userReplyTo);
    commentContentContainer.appendChild(commentContent);
    comment.appendChild (commentContentContainer);
        
    // Comments options 
    const commentOptions = document.createElement("div");
    commentOptions.classList.add("comment-options");
    const commentPoints = document.createElement("div");
    commentPoints.classList.add("comment-points");
    //More Btn
    const moreBtn = document.createElement("button");
    moreBtn.classList.add("more-btn");
    moreBtn.setAttribute("data-id", idCount);
    const moreIcon = document.createElement("i");
    moreIcon.classList.add("fa-solid");
    moreIcon.classList.add("fa-plus");
    moreBtn.appendChild(moreIcon);
    // Points
    const points = document.createElement("span");
    points.classList.add("points");
    points.textContent = 0;
    points.setAttribute("data-id", idCount);
        
    //Minus Btn
    const minusBtn = document.createElement("button");
    minusBtn.classList.add("minus-btn");
    minusBtn.setAttribute("data-id", idCount);
    const minusIcon = document.createElement("i");
    minusIcon.classList.add("fa-solid");
    minusIcon.classList.add("fa-minus");
    minusBtn.appendChild(minusIcon);
        
    // Reply button Or User Options
    const yourOptions = document.createElement("div");
    yourOptions.classList.add("your-options");
    //Delete Btn
    const deleteBtnUser = document.createElement("button");
    deleteBtnUser.classList.add("delete-btn");
    deleteBtnUser.setAttribute("data-id", idCount);
    const deleteBtnUserIcon = document.createElement("i");
    deleteBtnUserIcon.classList.add("fa-solid");
    deleteBtnUserIcon.classList.add("fa-trash");
    deleteBtnUser.textContent = "Delete";
    //Edit Btn
    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-btn");
    editBtn.setAttribute("data-id", idCount);
    const editBtnIcon = document.createElement("i");
    editBtnIcon.classList.add("fa-solid");
    editBtnIcon.classList.add("fa-pen");
    editBtn.textContent = "Edit";
                    
    deleteBtnUser.appendChild(deleteBtnUserIcon);
    editBtn.appendChild(editBtnIcon);
    yourOptions.appendChild(deleteBtnUser);
    yourOptions.appendChild(editBtn);

    commentPoints.appendChild(moreBtn);
    commentPoints.appendChild(points);
    commentPoints.appendChild(minusBtn);
    commentOptions.appendChild(commentPoints);
    commentOptions.appendChild(yourOptions);
    comment.appendChild(commentOptions);
    commentsContainer[Number(commentDivCont-1)].appendChild(comment);

    commentsContainer[Number(commentDivCont-1)].removeChild(replyTextarea);

    newCommentId = newCommentId.filter(item => item !== String(idComment));

    const objJSON = {
        content: text,
        createdAt: timestamp.textContent,
        id: Number(idCount),
        replyingTo: userReply,
        score: 0,
        user: {
            image: {
            webp: usernamePic,
            },
            username: username,
        }
    }

    dataArray[1][1][Number(commentDivCont-1)].replies.push(objJSON);


    loadFunctionality(dataArray, data);
}


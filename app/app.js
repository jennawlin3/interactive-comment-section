const commentContainer = document.querySelector(".comments-container");
let commentsArray = [];
let newCommentId = [];
let found = false;
let foundDelete = false;
let count = 0;

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
        //console.log(c);
        
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

        commentContainer.appendChild(comment);

        count = c.id;
        
        if(c.replies.length > 0) {
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

                commentContainer.appendChild(comment);
                
                if(countReply > count) {
                    count = countReply;
                }
             })
            }
        })
    loadFunctionality(dataArray, data);
    }
}

function loadFunctionality(dataArray, data) {
    const replyBtns = document.querySelectorAll(".reply-btn");
    const deleteBtns = document.querySelectorAll(".delete-btn");
    const editBtns = document.querySelectorAll(".edit-btn");
    const moreBtns = document.querySelectorAll(".more-btn");
    const minusBtns = document.querySelectorAll(".minus-btn");

    moreBtns.forEach((btn) => {
        btn.addEventListener("click", e => {
            if(e) {
                let id = btn.getAttribute("data-id");
                console.log(id);
                addPoints(dataArray, id);
                console.log(count);
            }
        }
        )
    });

    minusBtns.forEach((btn) => {
        let id = btn.getAttribute("data-id");
        btn.addEventListener("click", e => {
            if(e) {
                removePoints(dataArray, id);
            }
        }
        )
    });

    replyBtns.forEach((btn) => {
        btn.addEventListener("click", e => {
            if(e) {
                let id = btn.getAttribute("data-id");
                addNewComment(data, id);
            }
        })
    });

    deleteBtns.forEach((btn) => {
        btn.addEventListener("click", e => {
            if(e) {
                let id = btn.getAttribute("data-id");
                deleteComment(data, id);
            }
        })
    })
}

function addPoints(dataArray, id) {
    let comments = dataArray[1][1];
    const pointsSpan = document.querySelectorAll(".points");

    comments.forEach((c, i) => {
        if(c.id === Number(id)) {
            c.score++;
            pointsSpan[id-1].textContent = c.score;
            found = true;
            console.log(c);
            return;           
        } else {
            found = false;
        }
    })
    if(found === false) {
        repliesMorePoints(dataArray, id)
    }
}

function removePoints(dataArray, id) {
    let comments = dataArray[1][1];
    const pointsSpan = document.querySelectorAll(".points");
    //console.log(id);
    comments.forEach((c, i) => {
        if(c.id === Number(id)) {
            if(c.score === 0) {
                return;
            } else {
            c.score--;
            pointsSpan[id-1].textContent = c.score;
            found = true;
            console.log(c);
            return;    
                }
            } else {
            found = false;
        }
    })
    if(found === false) {
        repliesMinusPoints(dataArray, id)
    }
}

function repliesMorePoints(dataArray, id) {
    let comments = dataArray[1][1];
    const pointsSpan = document.querySelectorAll(".points");

    comments.forEach((c, i) => {
        if(c.replies) {
            c.replies.forEach((r,i) => {
                if(r.id === Number(id)) {
                    r.score++;
                    pointsSpan[id-1].textContent = r.score;
                    console.log(r);
                    return;
                }
            })
        }
    })  
}

function repliesMinusPoints(dataArray, id) {
    let comments = dataArray[1][1];
    const pointsSpan = document.querySelectorAll(".points");

    comments.forEach((c, i) => {
        if(c.replies) {
            c.replies.forEach((r,i) => {
                if(r.id === Number(id)) {
                    if(r.score === 0) {
                        return;
                    } else {
                    r.score--;
                    pointsSpan[id-1].textContent = r.score;              
                    //console.log(r);
                    return; 
                    }
                }
            })
        }
    })  
}

function addNewComment(data, id) {
    let c = data.currentUser;
    let commentContainer = document.querySelectorAll(".comments-container article");

    let comment = commentContainer[id-1];
    console.log(comment);
    console.log(id);

    if(newCommentId.indexOf(id) !== -1) {
        return
    } else {
    const newCommentContainer = document.createElement("section");
    newCommentContainer.classList.add("reply-comment_container");
    newCommentContainer.setAttribute("data-id", id);
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
    console.log(newCommentContainer);
    comment.after(newCommentContainer);
    newCommentId.push(id);         
    }
}

function deleteComment(data, id) {
    let comments = data.comments;
    const commentContainer = document.querySelector(".comments-container");
    const comment = document.querySelectorAll(".comments-container article");
    console.log("hola");
    console.log(id);

    comments.forEach((d) => {
        console.log(d);
        if(d.id === Number(id)) {
            console.log(id);
            delete d.id;
            delete d.content;
            delete d.createdAt;
            delete d.score;
            delete d.user;
            delete d.replies;        
            
            comment.forEach(c => {
                if(c.getAttribute("id") === id) {
                commentContainer.removeChild(c);
                foundDelete = true;
                console.log(data);
                return;
                }
            })
        }    
       foundDelete = false;
    })
    if(foundDelete === false) {
    deleteReply(data, id)
    }
}

function deleteReply(data, id) {
    let comments = data.comments;
    const commentContainer = document.querySelector(".comments-container");
    const comment = document.querySelectorAll(".comments-container article");

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
                
                comment.forEach(c => {
                    if(c.getAttribute("id") === id) {
                        commentContainer.removeChild(c);
                        }
                    })
                }
            })
         }
    })
    console.log(data);
}
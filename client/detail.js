// const axios = require('axios');
// import axios from 'axios';
const path = window.location.pathname;
const split = path.split("/")
const id = split[split.length - 1];

async function getPostDetail() {
    try {
        const res = await axios.get(`/detail-data/${id}`);
        const post = res.data[0];
        if (post === undefined) {
            location.href = "/";
        }

        document.querySelector("#update").addEventListener("click", () => {
            location.href = `/update/${id}`;
        });

        const comments = res.data;
        console.log(post);
        console.log(comments);

        const title = document.querySelector("#title");
        const dateTime = document.querySelector("#posted-date-time");
        const contents = document.querySelector("#contents");
        
        title.textContent = post.title;
        
        const dateTimeBefore = post.posted_date;
        dateTime.textContent = dayjs(dateTimeBefore).format('YYYY년 MM월 DD일 HH시 mm분');
        
        contents.innerHTML = post.contents.replaceAll('\n', '</br>');

        const commentList = document.querySelector('#comment-list')
        
        if (comments[0].created_date !== null) {
            Object.keys(comments).map((key) => {
                const data = comments[key];
    
                const commentsDiv = document.createElement('div');
                const dateTimeDiv = document.createElement('div');

                //댓글 수정 삭제는 나중에...
                
                commentsDiv.textContent = data.comments;
                
                const dateTimeBefore = data.created_date;
                dateTimeDiv.textContent = dayjs(dateTimeBefore).format('YYYY년 MM월 DD일 HH시 mm분');
    
                commentList.appendChild(commentsDiv);
                commentList.appendChild(dateTimeDiv);
            });
        }
    } catch(err) {
        console.log(err)
    }
}

//댓글 추가
document.querySelector("#form").addEventListener('submit', async (e) => {
    // e.preventDefault();
    const comment = e.target.input_comment.value;
    if (!comment) {
        return alert("내용을 입력하세요!");
    }
    try {
        await axios.post(`/post-comment/${id}`, {comment});
    } catch (err) {
        console.log(err);
    }
})


//게시글 수정
// document.querySelector("#update").addEventListener("click", () => {
//     try {
//         await axios.get(`/update/${id}`)
//     } catch(err) {
//         alert("수정 요청 중 오류가 발생했습니다. 다시 시도해주세요.")
//         console.log(err);
//     }
//     console.log("수정으로")
// })

//게시글 삭제
document.querySelector("#delete").addEventListener("click", async () => {
    if(confirm("정말 삭제하시겠습니까? 삭제하면 다시 복구할 수 없습니다.")) {
        try {
            await axios.delete(`/${id}`)
            
        } catch(err) {
            alert("삭제에 실패했습니다.");
            console.log(err);
        }
        alert("삭제 되었습니다.")
        location.href = "/"
    }
})

window.onload = getPostDetail;
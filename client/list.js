async function getPost() {
    try {
        const res = await axios.get("/post-data");
        const postList = res.data;
        // console.log(res.data);
        const list = document.querySelector('#post-list');
    
        postList.map((key) => {
            const postDiv = document.createElement('div');
            postDiv.className = "post";

            const linkToDetail = document.createElement('a');
            linkToDetail.className = "title";
            linkToDetail.href = `./detail/${key.id}`;
            const titleSpan = document.createElement('span');

            const dateSpan = document.createElement('span');

            titleSpan.textContent = key.title;

            const dateTimeBefore = key.posted_date;
            // const dateTimeAfter = dayjs(dateTimeBefore);
            dateSpan.textContent = dayjs(dateTimeBefore).format('YYYY년 MM월 DD일 HH시 mm분');
            
            linkToDetail.appendChild(titleSpan);
            postDiv.appendChild(linkToDetail);
            postDiv.appendChild(dateSpan);
            list.appendChild(postDiv);
            
            // console.log(res.data);
            // console.log(key);
        })
    } catch(err) {
        console.log(err);
    }
}

window.onload = getPost;
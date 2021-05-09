async function getPostDetail() {
    const path = window.location.pathname;
    const split = path.split("/")
    const id = split[split.length - 1];
    try {
        const res = await axios.get(`/detail-data/${id}`);
        const post = res.data[0];
        console.log(post);

        const title = document.querySelector("#title");
        const dateTime = document.querySelector("#posted-date-time");
        const contents = document.querySelector("#contents");
        
        title.textContent = post.title;
        
        const dateTimeBefore = post.posted_date;
        dateTime.textContent = dayjs(dateTimeBefore).format('YYYY년 MM월 DD일 HH시 mm분');
        
        contents.innerHTML = post.contents.replaceAll('\n', '</br>');
    } catch(err) {
        console.log(err)
    }
}

document.querySelector("#delete").addEventListener("click", () => {
    if(confirm("정말 삭제하시겠습니까? 삭제하면 다시 복구할 수 없습니다.")) {
        try {
            alert("삭제 되었습니다.");
            location.href = "/";
        } catch(err) {
            alert("삭제에 실패했습니다.");
            console.log(err);
        }
    }
})

window.onload = getPostDetail;
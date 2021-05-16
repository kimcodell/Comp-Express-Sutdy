const path = window.location.pathname;
const split = path.split("/");
const id = split[split.length - 1];

async function getPostDetail() {
    try {
        const res = await axios.get(`/detail-data/${id}`);
        const post = res.data[0];
        
        const title = document.querySelector("#input_title");
        const contents = document.querySelector("#input_contents");
        title.value = post.title;
        contents.value = post.contents;
    } catch(err) {
        console.log(err);
    }
}

if (id !== "post") {
    getPostDetail();
    document.getElementById('form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = e.target.input_title.value;
        const contents = e.target.input_contents.value;
        if (!title || !contents) {
            return alert("제목과 내용을 모두 입력하세요!");
        }
        try {
            await axios.put(`/update/${id}`, {title, contents});
        } catch (err) {
            console.log(err);
        }
        location.href = "/";
    })
} else {
    document.getElementById('form').addEventListener('submit', async (e) => {
        e.preventDefault(); //a 태그나 submit 태그는 누르면 href 를 통해 이동하거나, 창이 새로고침된다. preventDefault로 이런 동작을 막아줄 수 있다.
        const title = e.target.input_title.value;
        const contents = e.target.input_contents.value;
        if (!title || !contents) {
            return alert("제목과 내용을 모두 입력하세요!");
        }
        try {
            await axios.post('/post', {title, contents});
        } catch (err) {
            console.log(err);
        }
        location.href = "/";
        
        // e.target.input_title.value = '';
        // e.target.input_contents.value = '';
    })
}

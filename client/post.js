document.getElementById('form').addEventListener('submit', async (e) => {
    e.preventDefault(); //a 태그나 submit 태그는 누르면 href 를 통해 이동하거나, 창이 새로고침된다. preventDefault로 이런 동작을 막아줄 수 있다.
    const title = e.target.input_title.value;
    const contents = e.target.input_contents.value;
    if (!title || !contents) {
        return alert("제목과 내용을 모두 입력하세요!");
    }
    try {
        await axios.post('/post', {title, contents});
        location.href = "/";
    } catch (err) {
        console.log(err);
    }

    // e.target.input_title.value = '';
    // e.target.input_contents.value = '';
})
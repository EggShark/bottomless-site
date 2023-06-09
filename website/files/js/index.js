const miniBlogTemplate = document.getElementById("mini-card-template");
const miniBlogHolder = document.getElementById("blog-card-holder");
const miniBlogError = document.getElementById("mini-card-error");
const noContent = document.getElementById("no-content");

async function fetch2posts() {
    const res = await fetch("/api/recentBlogPosts?max=2");

    if (!res.ok) {
        return mini_card_error(res);
    }

    const buffer = await res.arrayBuffer();
    const cbmds = create_cbmd_from_buffer(buffer);

    if (cbmds.length == 0) {
        return no_content();
    }

    for (let i = 0; i < cbmds.length; i++) {
        const data = cbmds[i];
        const clone = miniBlogTemplate.content.firstElementChild.cloneNode(true);

        const link = clone.getElementsByTagName("a")[0];
        const title_text = clone.getElementsByTagName("h3")[0];
        const date_text = clone.getElementsByTagName("p")[0];
        const intro_text = clone.getElementsByTagName("p")[1];

        link.href = data.url;
        console.log(link);
        title_text.innerText = data.title;
        intro_text.innerText = data.intro;
        date_text.innerText = `${data.publish_date.getMonth()+1}/${data.publish_date.getDate()}/${data.publish_date.getFullYear()}`;

        miniBlogHolder.appendChild(clone);

        console.log(data, clone, title_text, date_text, intro_text);
    }

    const blog_link = document.createElement("a");
    blog_link.href = "/blog";
    blog_link.innerText = "see all posts ->";

    miniBlogHolder.appendChild(blog_link);
}

function mini_card_error(res) {
    console.log(res);
    const template = miniBlogError.content.firstElementChild.cloneNode(true);

    const error_text = template.getElementsByTagName("h3")[0];
    
    if (res.status == 429) {
        error_text.innerText = "You're making too many requests";
    } else {
        error_text.innerText = `Something Went Wrong (${res.status})`;
    }
    

    miniBlogHolder.appendChild(template);

    const blog_link = document.createElement("a");
    blog_link.href = "/blog";
    blog_link.innerText = "see all posts ->";

    miniBlogHolder.appendChild(blog_link);
}

function no_content() {
    const clone = noContent.content.firstElementChild.cloneNode(true);
    miniBlogHolder.appendChild(clone);


    const blog_link = document.createElement("a");
    blog_link.href = "/blog";
    blog_link.innerText = "see all posts ->";

    miniBlogHolder.appendChild(blog_link);
}

fetch2posts();
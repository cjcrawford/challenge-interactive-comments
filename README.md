# Frontend Mentor - Interactive comments section solution

This is a solution to the [Interactive comments section challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/interactive-comments-section-iG1RugEG9). Frontend Mentor challenges help you improve your coding skills by building realistic projects. 

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)  
- [Author](#author)

## Overview

### The challenge

Users should be able to:

- [x] View the optimal layout for the app depending on their device's screen size
- [x] See hover states for all interactive elements on the page
- [x] Create, Read, Update, and Delete comments and replies
- [x] Upvote and downvote comments
- [x] **Bonus**: If you're building a purely front-end project, use `localStorage` to save the current state in the browser that persists when the browser is refreshed.

### Screenshot

![Screen shot of solution](./Screenshot.png)

### Links

- [Solution URL](https://github.com/cjcrawford/challenge-interactive-comments)
- [Live Site URL](https://interactive-comments.cjcrawford.com)

## My process

### Built with

- Semantic HTML5 markup
- CSS with a splash of BEM
- Mobile-first workflow
- [VueJS](https://vuejs.org/) - Vue framework

### What I learned

CSS `order` property and `flex-basis` was essential for positioning the comment buttons on desktop vs mobile.

```css
.comment__toolbar {
  order: 3;
  display: flex;
  align-items: center;
  flex: 1 1 0%;
  justify-content: end;
}

@media (min-width: 768px) {
    .comment__toolbar {
        order: unset;
        position: absolute;
        /** this could easily be top: 19px; leaving it complex for future variable upgrade
            (card top padding - ( 1/2 button padding )) 
        */
        top: calc(24px - (10px / 2));
        /** this could easily be right: 18px; leaving it complex for future variable upgrade
            (card right padding - ( 1/2 button padding )) 
        */
        right: calc(24px - (12px / 2));
    }
}
```

Firefox and safari have quite different native form element styles. Not using a framework with a reset or normalize like Tailwind or Bootstrap, I learned how difficult it is to create your own styles for form elements.

```css
textarea {
  border-radius: 8px;
  padding: 12px 24px;
  background-color: var(--theme-white);
  color: var(--color-text);
  border: 1px solid var(--theme-light-gray);
  min-height: 96px;
  display: block;
  width: 100%;
  max-width: 100%;
  caret-color: var(--theme-moderate-blue);
  border-block: 1px solid var(--theme-light-gray);
}

textarea:active {
  border-color: var(--theme-moderate-blue);
}

textarea,
textarea::placeholder {
  font-size: 16px;
  line-height: 24px;
  font-family: 'Rubik', Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
}

textarea::placeholder {
  color: var(--theme-grayish-blue);
}
```

Keeping the textarea inside its `flex` container when manually resizing it was a little tricky until I discovered `min-width: 0`. Thanks CSS Tricks!

```css
  .comment__content {
    min-width: 0;    
  }
```

Since the data structure and design does not allow more than one level of nested replies, the javascript and composition seemed overly complicated. I think I could have simplified everything by handling the functional logic at the parent component. Dumb components are usually my preference anyways for better flexibility.

```js
export const deleteComment = async (comment, parent) => {
  // @todo: API call
  await mockApiCall();

  if (parent) {
    return deleteReply(comment, parent);
  }

  const commentIndex = comments.findIndex(({ id }) => id === comment.id);
  if (commentIndex === -1) {
    return Promise.reject(new Error("This comment has already been deleted"));
  }

  comments.splice(commentIndex, 1);

  persistLocalStorage();

  return Promise.resolve();
};
```

Modal and background scrolling has always been a challenge. Generally I would reach for the popular npm package [body-scroll-lock](https://www.npmjs.com/package/body-scroll-lock), but I really liked the simplicity of how [tailwindcss](https://tailwindcss.com/) approached it (pretty classic, even!);

```javascript
watch(
  () => props.show,
  (value) => {
    if (value) {
      document.querySelector("body").classList.add("modal--active");
    } else {
      document.querySelector("body").classList.remove("modal--active");
    }
  }
);
```

```css
.modal--active {
  overflow: hidden !important;
}
```

I used the provided sketch document to try to match everything pixel perfect. In a real project I think I would prefer to use `rem` instead of `px`. If there's a plugin for sketch that translates pixels to `rem` I would love to check it out!

## Author

- Frontend Mentor - [@@cjcrawford](https://www.frontendmentor.io/profile/cjcrawford)

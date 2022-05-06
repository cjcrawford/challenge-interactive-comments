<template>
  <form class="card comment-form" @submit.prevent="handleSubmit">
    <img class="avatar" :src="user.image.png" alt="avatar" />
    <textarea
      :id="formId"
      aria-label="Add a comment"
      placeholder="Add a comment ..."
      v-model="commentContent"
    ></textarea>
    <button
      type="submit"
      class="button button--rounded button--blue"
      :disabled="isLoading"
    >
      Send
    </button>
  </form>
</template>

<script>
import { ref } from "vue";
import { v4 as uuid } from "uuid";
import { user } from "../services/useAuth.js";
import { addComment, addReply } from "../services/useComments.js";

export default {
  name: "CommentForm",

  props: {
    comment: {
      type: Object,
    },
    parent: {
      type: Object,
    },
  },

  setup(props, { emit }) {
    const commentContent = ref("");
    const isLoading = ref(false);
    const formId = uuid();

    if (props.comment && props.comment?.user?.username) {
      commentContent.value = `@${props.comment.user.username} `;
    } else if (props.parent && props.parent?.user?.username) {
      commentContent.value = `@${props.parent.user.username} `;
    }

    const handleSubmit = async () => {
      isLoading.value = true;
      try {
        if (!props.parent) {
          await addComment(commentContent.value);
        } else {
          await addReply(commentContent.value, props.comment, props.parent);
        }

        commentContent.value = "";
        emit("hideForm", true);
      } catch (e) {
        // @todo handle error
        console.log(e);
      } finally {
        isLoading.value = false;
      }
    };

    return {
      commentContent,
      user,
      formId,
      isLoading,
      handleSubmit,
    };
  },
};
</script>

<style>
.comment-form {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}

.comment-form img {
  order: 2;
}

.comment-form textarea {
  order: 1;
  flex: 1 1 auto;
  margin-bottom: 16px;
}

.comment-form button {
  order: 3;
  flex: none;
  width: 104px;
}

@media (min-width: 768px) {
  .comment-form {
    align-items: flex-start;
    flex-wrap: nowrap;
  }

  .comment-form img {
    order: unset;
    margin-bottom: 0;
  }

  .comment-form textarea {
    order: unset;
    margin: 0 20px;
  }

  .comment-form button {
    order: unset;
  }
}
</style>

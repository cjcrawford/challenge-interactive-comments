<template>
  <section>
    <div class="card comment">
      <CommentVote class="comment__vote" :comment="comment" />

      <div class="comment__content">
        <div class="comment__headline">
          <figure>
            <img
              class="avatar"
              :src="comment.user.image.png"
              :alt="`avatar of user ${comment.user.username}`"
            />
          </figure>

          <h3 style="margin-left: 16px">{{ comment.user?.username }}</h3>
          <span v-if="isCurrentUserComment" class="comment__headline__you">
            you
          </span>
          <span class="comment__headline__date">
            {{ comment.createdAt }}
          </span>
        </div>
        <!-- Edit Own Comment-->
        <form
          v-if="isEditState"
          @submit.prevent="handleUpdateContent"
          class="comment__form"
        >
          <textarea
            :key="`edit-comment:${comment.id}`"
            :id="`edit-comment:${comment.id}`"
            :name="`edit-comment:${comment.id}`"
            v-model="editContentModel"
          >
          </textarea>

          <div
            style="
              margin-top: 20px;
              display: flex;
              align-items: center;
              justify-content: space-between;
            "
          >
            <button
              type="button"
              aria-label="update"
              class="button button--light-gray button--rounded"
              @click="handleCancelUpdate"
              :disabled="isLoading"
            >
              Cancel
            </button>
            <button
              type="submit"
              aria-label="update"
              class="button button--blue button--rounded"
              :disabled="isLoading"
            >
              Update
            </button>
          </div>
        </form>

        <p v-else>
          <a
            v-if="comment.replyingTo"
            :href="`/u/${comment.replyingTo}`"
            class="button button--blue"
            :aria-label="`Profile page of ${comment.replyingTo}`"
            @click.prevent.stop="() => false"
          >
            @{{ comment.replyingTo }}
          </a>
          {{ comment.content }}
        </p>
      </div>

      <div class="comment__toolbar">
        <!-- AUTH state: authenticated -->
        <template v-if="isCurrentUserComment">
          <button
            type="button"
            aria-label="delete comment"
            class="button button--red button--flex"
            :disabled="isEditState"
            @click="showDeleteModal = true"
          >
            <svg width="12" height="14" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1.167 12.448c0 .854.7 1.552 1.555 1.552h6.222c.856 0 1.556-.698 1.556-1.552V3.5H1.167v8.948Zm10.5-11.281H8.75L7.773 0h-3.88l-.976 1.167H0v1.166h11.667V1.167Z"
              />
            </svg>
            Delete
          </button>
          <button
            type="button"
            aria-label="edit comment"
            class="button button--blue button--flex"
            :disabled="isEditState"
            @click="isEditState = true"
          >
            <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M13.479 2.872 11.08.474a1.75 1.75 0 0 0-2.327-.06L.879 8.287a1.75 1.75 0 0 0-.5 1.06l-.375 3.648a.875.875 0 0 0 .875.954h.078l3.65-.333c.399-.04.773-.216 1.058-.499l7.875-7.875a1.68 1.68 0 0 0-.061-2.371Zm-2.975 2.923L8.159 3.449 9.865 1.7l2.389 2.39-1.75 1.706Z"
              />
            </svg>
            Edit
          </button>

          <Teleport to="body">
            <Modal :show="showDeleteModal" @close="showDeleteModal = false">
              <template #header>
                <h3>Delete comment</h3>
              </template>

              <template #body>
                <p>
                  Are you sure you want to delete this comment? This will remove
                  the comment and can’t be undone.
                </p>
              </template>

              <template #footer>
                <button
                  type="button"
                  aria-label="No, cancel"
                  class="button button--gray button--rounded"
                  @click="showDeleteModal = false"
                >
                  No, cancel
                </button>

                <button
                  type="button"
                  aria-label="Yes, delete"
                  class="button button--red button--rounded"
                  @click="handleDelete"
                >
                  Yes, delete
                </button>
              </template>
            </Modal>
          </Teleport>
        </template>

        <!-- AUTH state: guest -->
        <template v-else>
          <!-- REPLY state: not showing reply -->
          <button
            v-if="!showReply"
            type="button"
            class="button button--blue button--flex"
            :aria-label="`Reply to ${comment.user?.username}`"
            @click="showReply = true"
          >
            <svg
              style="margin-right: 8px"
              width="14"
              height="13"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z"
              />
            </svg>
            Reply
          </button>

          <!-- REPLY state: showing reply -->
          <template v-else>
            <button
              type="button"
              class="button button--red button--flex"
              :aria-label="`Reply to ${comment.user?.username}`"
              @click="showReply = false"
            >
              <svg
                style="margin-right: 8px"
                width="14"
                height="13"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z"
                />
              </svg>
              Cancel
            </button>
          </template>
        </template>
      </div>
    </div>

    <transition name="fade">
      <CommentForm
        v-if="showReply"
        :comment="comment"
        :parent="parent"
        @hideForm="showReply = false"
      />
    </transition>

    <slot name="replies" />
  </section>
</template>

<script>
import { ref, computed } from "vue";
import { isLoggedIn, user } from "../services/useAuth.js";
import { updateComment, deleteComment } from "../services/useComments.js";
import CommentForm from "./CommentForm.vue";
import CommentVote from "./CommentVote.vue";
import Modal from "./Modal.vue";

export default {
  name: "CommentDisplay",

  components: {
    CommentForm,
    CommentVote,
    Modal,
  },

  props: {
    comment: {
      type: Object,
      required: true,
    },
    parent: {
      type: Object,
      required: false,
    },
  },

  setup(props) {
    const showReply = ref(false);
    const isEditState = ref(false);
    const isLoading = ref(false);
    const showDeleteModal = ref(false);
    const editContentModel = ref(`${props.comment.content}`);

    const isCurrentUserComment = computed(
      () => user.username === props.comment.user.username
    );

    const handleDelete = async () => {
      isLoading.value = true;
      try {
        await deleteComment(props.comment, props.parent);
      } catch (e) {
        // @todo handle error
      } finally {
        isLoading.value = false;
      }
    };

    const handleUpdateContent = async () => {
      // make api call

      isLoading.value = true;
      try {
        await updateComment(
          editContentModel.value,
          props.comment,
          props.parent
        );
      } catch (e) {
        // @todo handle error
        console.log(e);
      } finally {
        isLoading.value = false;
      }

      // revert edit state
      isEditState.value = false;
    };

    const handleCancelUpdate = () => {
      // revert edit state
      isEditState.value = false;
      // reset local model data back to api state
      editContentModel.value = `${props.comment.content}`;
    };

    return {
      user,
      isLoggedIn,
      showReply,
      showDeleteModal,
      isCurrentUserComment,
      isEditState,
      isLoading,
      editContentModel,
      handleUpdateContent,
      handleCancelUpdate,
      handleDelete,
    };
  },
};
</script>

<style scoped>
p {
  margin-block-start: 0;
  margin-block-end: 0;
}

.card {
  margin-bottom: 16px;
}

.comment {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.comment__vote {
  background-color: var(--theme-light-gray);
  border-radius: 10px;
  font-weight: 500;
  color: var(--theme-moderate-blue);
  order: 2;
  display: flex;
  align-items: center;
  flex: none;
}

.comment__toolbar {
  order: 3;
  display: flex;
  align-items: center;
  flex: 1 1 0%;
  justify-content: end;
}

.comment__toolbar .button {
  padding: 10px 12px; /** adds complexity but improves click area */
}

.comment__toolbar .button svg {
  margin-right: 8px;
}

.comment__content {
  min-width: 0;
  width: 100%;
  flex: 1 1 auto;
  order: 1;
  margin-bottom: 16px;
}

.comment__form {
  width: 100%;
}

.comment__form textarea {
  min-width: 0;
  max-width: 100%;
  width: 100%;
}

.comment__headline {
  font-size: 16px;
  color: var(--color-heading);
  display: flex;
  margin-bottom: 16px;
  align-items: center;
}

.comment__headline h3 {
  font-weight: 500;
}

.comment__headline img {
  flex: none;
}

.comment__headline__date {
  font-weight: 400;
  margin-left: 16px;
  color: var(--color-text);
}

.comment__headline__you {
  background-color: var(--theme-moderate-blue);
  border-radius: 2px;
  color: var(--theme-white);
  margin-left: 8px;
  padding: 1px 6px;
  font-size: 13px;
  font-weight: 500;
}

@media (min-width: 768px) {
  .card {
    margin-bottom: 20px;
  }

  .comment {
    flex-wrap: nowrap;
    align-items: flex-start;
  }

  .comment__vote {
    flex-direction: column;
    order: unset;
  }

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

  .comment__content {
    min-width: 0;
    margin-left: 24px;
    margin-bottom: 0;
    order: unset;
  }
}
</style>

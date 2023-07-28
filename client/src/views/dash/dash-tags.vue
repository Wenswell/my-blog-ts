<template>
  <main>
    <div>src\views\dash\tags.vue</div>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>标签名</th>
          <th>博客数量</th>
          <th>操作</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="tag in tagList" :key="tag.id">
          <td>{{ tag.id }}</td>
          <td>{{ tag.tagName }}</td>
          <td>{{ tag.count }}</td>
          <td>
            <button @click="editTag(tag)">修改</button>
            <button @click="toDel(tag)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <dialog ref="delDialog">
      <div class="delete-card">
        <p class="info">
          <i class="ri-information-line"></i>
          确定删除「{{ deleteTagName }}」吗？
        </p>
        <footer class="handle">
          <button class="cancel mild-effect" @click="delDialog?.close()">
            算了
          </button>
          <button class="delete mild-effect" @click="onDel">删了</button>
        </footer>
      </div>
    </dialog>
    <dialog ref="editDialog">
      <div class="edit-card">
        <span class="info">
          <i class="ri-information-line"></i>
          修改「{{ editTagName }}」
        </span>
        <form @submit.prevent="onEdit">
          <p>
            <input type="text" v-model="newTagName" required />
          </p>
          <footer class="handle">
            <button
              type="button"
              class="cancel mild-effect"
              @click="editDialog?.close()"
            >
              算了
            </button>
            <button type="submit" class="delete mild-effect">修改</button>
          </footer>
        </form>
      </div>
    </dialog>
    <Popup ref="popupRef" />
  </main>
</template>

<script setup lang="ts">
import { getTag, ITagItem, updateTagById, delTagById } from '@/api'
import { onMounted, ref } from 'vue'
import Popup from '@/components/Notice.vue'
import { CNotice } from '@/utils/type'
let popupRef = ref<CNotice | null>(null)
const delDialog = ref<HTMLDialogElement | null>(null)
const editDialog = ref<HTMLDialogElement | null>(null)

const tagList = ref<ITagItem[]>([])
const getTagList = async () => {
  const aaa = await getTag()
  tagList.value = aaa.data
}
const editTagId = ref('')
const editTagName = ref('')
const newTagName = ref('')
const editTag = ({ id, tagName }: { id: string; tagName: string }) => {
  newTagName.value = tagName
  editTagName.value = tagName
  editTagId.value = id
  editDialog.value?.showModal()
}
const onEdit = async () => {
  const reres = await updateTagById({
    id: editTagId.value,
    tagName: newTagName.value,
  })
  if (editTagName.value === reres.data.oldName) {
    editDialog.value?.close()
    popupRef.value?.notice.success(
      `已修改标签「${reres.data.oldName}」为「${reres.data.tagName}」`,
    )
  } else {
    popupRef.value?.notice.error(`有地方出错了...`)
  }
  getTagList()
}

const deleteTagId = ref('')
const deleteTagName = ref('')
const toDel = ({ id, tagName }: { id: string; tagName: string }) => {
  deleteTagName.value = tagName
  deleteTagId.value = id
  delDialog.value?.showModal()
}
const onDel = async () => {
  const reres = await delTagById({ id: deleteTagId.value })
  if (deleteTagId.value === reres.data.deletedId) {
    delDialog.value?.close()
    popupRef.value?.notice.success(`标签「${deleteTagName.value}」已删除`)
  } else {
    popupRef.value?.notice.error(`有地方出错了...`)
  }
  getTagList()
}
onMounted(() => {
  getTagList()
})
</script>

<style lang="scss" scoped>
table {
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  th {
    background-color: #f2f2f2;
    font-weight: bold;
  }

  tr:hover {
    background-color: #eee;
  }

  button {
    margin: 0 5px;
    padding: 5px 10px;
    border: none;
    border-radius: 4px;

    &:hover {
      background: #ddd;
    }
  }
}

.dark {
  // 定义颜色变量
  $table-bg: #333;
  $text-color: #ccc;

  table {
    background-color: $table-bg;

    th,
    td {
      color: $text-color;
      border-bottom: 1px solid lighten($table-bg, 10%);
    }

    th {
      background-color: lighten($table-bg, 5%);
    }

    tr:hover {
      background-color: lighten($table-bg, 10%);
    }

    button {
      background-color: lighten($table-bg, 20%);

      &:hover {
        background-color: lighten($table-bg, 30%);
      }
    }
  }
}

dialog {
  border-radius: $gap-xs;
}

.delete-card {
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  .info {
    display: flex;
    align-items: center;

    i {
      margin-right: $gap-xs;
      font-size: $fz-l;
      color: #d03050;

      .dark & {
        color: lighten(#d03050, 10);
      }
    }
  }

  .delete {
    color: #d03050;
    margin-inline: $gap-s;

    .dark & {
      color: lighten(#d03050, 10);
    }
  }
}

.edit-card {
  display: flex;
  flex-direction: column;

  .info {
    display: flex;
    align-items: center;

    i {
      margin-right: $gap-xs;
      font-size: $fz-l;
      color: #f0a020;

      .dark & {
        color: lighten(#f0a020, 10);
      }
    }
  }

  .handle {
    display: flex;
    justify-content: flex-end;
  }

  .delete {
    color: #f0a020;
    margin-inline: $gap-s;

    .dark & {
      color: lighten(#f0a020, 10);
    }
  }
}
</style>

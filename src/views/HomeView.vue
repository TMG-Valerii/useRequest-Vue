<script setup>
import { ref, computed, watch } from 'vue';
import { useRequest } from '../hooks/useRequest';

const page = ref(1);
const filter = ref('');

const request = useRequest('https://reqres.in/api/users');
request.send({ query: { page: page.value } });

watch(page, page => request.send({ query: { page } }));

const filtered = computed(() => request.metadata.json.data.filter(item => new RegExp(filter.value.trim(), 'ig').test(item.email)))

</script>

<template>
  <div>

    <div>
      <input type="text" v-model="filter">
    </div>
    <div>
      <button @click="page -= 1">PREV</button>
      ({{ page }})
      <button @click="page += 1">NEXT</button>
    </div>

    <div>
      <template v-if="request.metadata.loading">
        LOADING IN PROGRESS
      </template>
      <template v-else>
        <template v-if="request.metadata.success">
          <template v-if="!request.metadata.json.data.length">
            TABLE EMPTY
          </template>
          <template v-else>
            <table>
              <tr v-for="item in filtered">
                <td>{{ item.email }}</td>
                <td>{{ item.first_name }}</td>
                <td>{{ item.last_name }}</td>
              </tr>
            </table>
          </template>
        </template>
        <template v-else>
          ERROR HAPPENED
        </template>
      </template>
    </div>
  </div>
</template>

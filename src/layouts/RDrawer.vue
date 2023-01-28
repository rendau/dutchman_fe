<template>
  <q-drawer :value="!!selectedMsg" elevated side="right"
            content-class="bg-grey-1" :width="350"
            @input="onDrawerInput">
    <div class="fit column items-stretch">
      <div class="col-auto q-pa-xs">
        <q-btn dense outline icon="chevron_right" color="primary" class="q-px-xs"
               @click="onDrawerInput(false)"/>
      </div>

      <div class="col fit">
        <div class="fit overflow-auto">
          <div class="full-width row items-center q-pt-md q-px-sm q-pb-lg" style="min-height: 100%">
            <div class="full-width">
              <div class="column items-stretch q-gutter-y-md">
                <!-- header -->
                <div class="full-width text-center">
                  <div>
                    <ac-level-badge :data="msg"/>
                  </div>

                  <div class="text-bold text-grey-9 q-pt-sm">
                    {{ msg[$cns.SfTagFieldName] || '---' }}
                  </div>

                  <div class="text-grey-9 q-pt-sm">
                    {{ $u.fmtDatetimeSimple(msg[$cns.SfTsFieldName]) || '---' }}
                  </div>
                </div>

                <div>
                  <q-separator/>
                </div>

                <!-- main data -->
                <div v-for="item in mainData" :key="`main-field-${item.k}`" class="full-width">
                  <div class="text-subtitle2 lh-1_1 text-blue-grey-4 q-pb-xs">
                    {{ item.k }}:
                  </div>

                  <div class="text-body2 lh-1_3 q-pl-md" style="word-wrap: break-word">
                    {{ item.v || '---' }}
                  </div>
                </div>

                <!-- rest data -->
                <div v-for="item in restData" :key="`rest-field-${item.k}`" class="full-width">
                  <div class="text-subtitle2 lh-1_1 text-lime-8 q-pb-xs">
                    {{ item.k }}:
                  </div>

                  <div class="text-body2 lh-1_3 q-pl-md" style="word-wrap: break-word">
                    {{ item.v || '---' }}
                  </div>
                </div>

                <!-- expand/shrink button -->
                <div class="text-center">
                  <q-btn flat dense no-caps size=".8rem"
                         :icon-right="$store.state.log.selectedMsgExpanded ? 'expand_less' : 'expand_more'"
                         :label="$store.state.log.selectedMsgExpanded ? 'shrink' : 'expand'"
                         color="primary"
                         class="q-px-sm"
                         @click="$store.commit('log/toggleSelectedMsgExpanded')"/>
                </div>

                <!-- expandable data -->
                <template v-if="$store.state.log.selectedMsgExpanded">
                  <div v-for="item in expandableData" :key="`expandable-field-${item.k}`" class="full-width">
                    <div class="text-subtitle2 lh-1_1 text-lime-8 q-pb-xs">
                      {{ item.k }}:
                    </div>

                    <div class="text-body2 lh-1_3 q-pl-md" style="word-wrap: break-word">
                      {{ item.v || '---' }}
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-drawer>
</template>

<script setup>
</script>

<template>
  <div class="cascader-panel-item">
    <div class="cascader-panel-item__header">{{title}}</div>
    <div class="cascader-panel-item__content">
      <div class="cascader-panel-item__list-item allcheck"
           v-if="hasAllCheck && data.length">
        <el-checkbox class="cascader-panel-item__checkbox"
                     v-model="isAllCheck"
                     :indeterminate="isAllIndeterminate"
                     :disabled="isAllDisabled"
                     @change="handleAllCheckChange"></el-checkbox>
        <span class="cascader-panel-item__text"
              @click.stop="handleSelectAll"
              :class="{'cascader-panel-item__textChecked':isAllCheck}">全选</span>
      </div>
      <template v-if="data && data.length">
        <div class="cascader-panel-item__list-item"
             v-for="(item,index) in data"
             :key="item.id"
             :class="getItemClass(item)"
             @click.stop="handleSelect(item,index,$event)">
          <el-checkbox :disabled="item.disabled"
                       class="cascader-panel-item__checkbox"
                       v-model="checkList[index].checked"
                       :indeterminate="checkList[index].indeterminate"
                       v-show="showCheckBox && checkList[index]"
                       @click.stop.native="_handleCheckClick(item)"
                       @change="checked => handleChange(checked,item)"></el-checkbox>
          <el-popover placement="top-start"
                      class="cascader-panel-item__text"
                      :open-delay="500"
                      trigger="hover">
            <span>{{item.text}}</span>
            <span slot="reference"
                  :class="{'cascader-panel-item__textChecked':checkList[index].checked}"
                  :title="item.text">{{item.text}}</span>
          </el-popover>
        </div>
      </template>
      <template v-else>
        <div class="cascader-panel-item__list-item-default">
          <p>暂无数据</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "CascaderItem",
  props: {
    title: {
      type: String,
      required: true
    },
    data: {
      type: Array
    },
    level: {
      type: Number
    },
    maxLevel: {
      type: Number
    },
    showCheckBox: {
      type: Boolean,
      default: true
    },
    hasAllCheck: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      checkList: this.data.map(item => {
        return { checked: item.checked, indeterminate: item.indeterminate };
      })
    };
  },
  watch: {
    data: {
      deep: true,
      handler(nv) {
        this.checkList = nv.map(item => {
          return {
            checked: item.checked,
            indeterminate: item.indeterminate
          };
        });
      }
    }
  },
  computed: {
    isAllCheck: {
      get() {
        return this.checkList.every(item => item.checked);
      },
      set() {
        return false;
      }
    },
    isAllIndeterminate: {
      get() {
        return (
          !(
            this.checkList.every(item => item.checked) ||
            this.checkList.every(item => !item.checked)
          ) || this.checkList.some(item => item.indeterminate)
        );
      },
      set() {
        return false;
      }
    },
    isAllDisabled() {
      return !!this.data.find(v => v.disabled);
    }
  },
  methods: {
    handleSelect({ id, childNodes, selected, disabled }, index, e) {
      if (
        (e.target.matches(".el-checkbox__original") ||
          e.target.matches(".el-checkbox__inner")) &&
        (!childNodes || !childNodes.length)
      ) {
        return;
      }
      this.$emit("select", id);
      if (disabled) return;
      // 如果是leaf节点，则相当于直接进行一次check
      if (!childNodes || !childNodes.length) {
        this.checkList[index].checked = !this.checkList[index].checked;
        this.$emit("check", this.checkList[index].checked, id);
      }
    },
    handleSelectAll() {
      console.log("0")
      this.$emit("selectAll");
    },
    handleChange(checked, { id }) {
      this.$emit("check", checked, id);
    },
    getItemClass(item) {
      return item.selected && (item.childNodes && item.childNodes.length)
        ? "is-select"
        : "";
    },
    handleAllCheckChange(checked) {
      this.checkList.forEach(item => {
        item.checked = checked;
      });

      this.$emit("check-all", checked, this.data[0].parent.id);
    },
    _handleCheckClick({ id }) {
      this.$emit("check-click", id);
    }
  }
};
</script>

<style lang="less" scoped>
@prefix: cascader-panel-item;
.@{prefix} {
  background-color: #fdfdfd;
  min-width: 100px;
}
.@{prefix}__header {
  letter-spacing: 0;
  border-bottom: 1px solid #dee4f5;
  background-color: #fafbfe;
  font-size: 13px;
  padding: 0 12px;
  line-height: 36px;
}
.@{prefix}__content {
  overflow: auto;
  height: calc(100% - 48px);
}
.@{prefix}__list-item {
  position: relative;
  display: flex;
  padding: 0 15px;
  height: 37.9px;
  line-height: 36px;
  cursor: pointer;
  border-bottom: 1px dashed #c9c9c9;
  &.is-select,
  &:hover {
    background: #f5fbff;
    color: #009bff;
    z-index: 9;
  }
}
.@{prefix}__list-item-default {
  p {
    line-height: 30px;
    color: #ccc;
    padding: 10px;
    box-sizing: border-box;
  }
}
.@{prefix}__checkbox {
  // position: absolute;
  // margin-right: 10px;
}

.@{prefix}__text {
  font-size: 13px;
  letter-spacing: 0;
  // line-height: 12px;
  display: inline-block;
  max-width: 85%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.@{prefix}__textChecked {
  color: #0590ff !important;
}
.@{prefix}__toright {
  // float: right;
  position: absolute;
  right: 5px;
}
</style>

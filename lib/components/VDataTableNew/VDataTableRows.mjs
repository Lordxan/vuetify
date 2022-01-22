import { createVNode as _createVNode, createTextVNode as _createTextVNode } from "vue";
import { convertToUnit, createRange, defineComponent } from "../../util/index.mjs";
import { useExpanded, VDataTableExpandedKey } from "./VDataTable.mjs";
export const VDataTableRows = defineComponent({
  name: 'VDataTableRows',
  props: {
    columns: {
      type: Array,
      required: true
    },
    items: {
      type: Array,
      required: true
    },
    rowHeight: {
      type: Number,
      required: true
    },
    offsetStart: {
      type: Number
    },
    startIndex: {
      type: Number,
      default: 0
    },
    stopIndex: {
      type: Number,
      default: 0
    },
    loading: Boolean,
    showLoader: Boolean
  },

  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      toggleExpand
    } = useExpanded();
    return () => {
      if (props.showLoader && props.loading) {
        return createRange(props.stopIndex - props.startIndex).map(i => _createVNode("tr", {
          "class": "v-data-table__tr",
          "role": "row",
          "key": `loading_${i}`
        }, [props.columns.map(column => _createVNode("td", {
          "class": ['v-data-table__td'],
          "style": {
            height: `${props.rowHeight}px`,
            transform: `translateY(${convertToUnit(props.offsetStart)})`
          },
          "role": "cell"
        }, [_createTextVNode("loading")]))]));
      }

      return props.items.map((item, rowIndex) => item[VDataTableExpandedKey] ? _createVNode("tr", {
        "class": "v-data-table__tr v-data-table__tr--expanded",
        "role": "row",
        "key": `expanded_${item.id}`
      }, [_createVNode("td", {
        "class": "v-data-table__td",
        "style": {
          height: `${props.rowHeight}px`,
          transform: props.offsetStart ? `translateY(${convertToUnit(props.offsetStart)})` : undefined,
          'grid-area': `auto / 1 / auto / ${props.columns.length + 1}`
        }
      }, [_createTextVNode("expanded row")], 4)]) : _createVNode("tr", {
        "class": "v-data-table__tr",
        "role": "row",
        "onClick": () => {
          toggleExpand(props.startIndex + rowIndex, item);
        },
        "key": `row_${item.id}`
      }, [props.columns.map((column, colIndex) => {
        var _slots$, _slots$2;

        return _createVNode("td", {
          "class": ['v-data-table__td'],
          "style": {
            height: `${props.rowHeight}px`,
            transform: `translateY(${convertToUnit(props.offsetStart)})`
          },
          "role": "cell"
        }, [(_slots$ = (_slots$2 = slots[`item.${column.id}`]) == null ? void 0 : _slots$2.call(slots)) != null ? _slots$ : item[column.id]]);
      })], 8, ["onClick"]));
    };
  }

});
//# sourceMappingURL=VDataTableRows.mjs.map
import { createVNode as _createVNode } from "vue";
import { defineComponent } from "../../util/index.mjs";
export const VDataTableHeaders = defineComponent({
  name: 'VDataTableHeaders',
  props: {
    rows: {
      type: Array,
      required: true
    },
    rowHeight: {
      type: Number,
      required: true
    },
    sticky: Boolean
  },

  setup(props, _ref) {
    let {
      slots
    } = _ref;
    return () => {
      return props.rows.map((row, i) => _createVNode("tr", {
        "class": "v-data-table__tr",
        "role": "row"
      }, [row.map(column => {
        var _column$rowspan;

        return _createVNode("th", {
          "class": "v-data-table__th",
          "style": { ...column.style,
            height: `${props.rowHeight * ((_column$rowspan = column.rowspan) != null ? _column$rowspan : 1)}px`,
            ...(props.sticky && {
              position: 'sticky',
              zIndex: 2,
              top: `${props.rowHeight * i}px`
            })
          },
          "role": "columnheader",
          "colspan": column.colspan,
          "rowspan": column.rowspan
        }, [column.name], 12, ["colspan", "rowspan"]);
      })]));
    };
  }

});
//# sourceMappingURL=VDataTableHeaders.mjs.map
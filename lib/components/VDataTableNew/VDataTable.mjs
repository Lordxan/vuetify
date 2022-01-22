import { resolveDirective as _resolveDirective, createVNode as _createVNode } from "vue";
import { computed, inject, provide, ref, watch } from 'vue';
import { convertToUnit, createRange, defineComponent } from "../../util/index.mjs";
import { VDataTableHeaders } from "./VDataTableHeaders.mjs";
import "./VDataTable.css";
import { VDataTableRows } from "./VDataTableRows.mjs";

function isMultipleHeaders(arr) {
  return arr.length > 0 && Array.isArray(arr[0]);
}

export const useHeaders = props => {
  const headerRows = ref([]);
  const rowColumns = ref([]);
  watch(() => props.headers, () => {
    const rows = isMultipleHeaders(props.headers) ? props.headers : [props.headers];
    const width = rows[rows.length - 1].length + (rows.length > 1 ? rows.slice(0, rows.length - 1).reduce((count, row, index) => {
      return count + row.filter(col => {
        var _col$rowspan;

        return index + ((_col$rowspan = col.rowspan) != null ? _col$rowspan : 0) === rows.length ? 1 : 0;
      }).length;
    }, 0) : 0);
    rowColumns.value = Array(width);
    const rowsWithStyle = [];
    let rowStart = 1;
    const colStart = createRange(width).map(() => 1);

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const columnsWithStyle = [];

      for (let colIndex = 0; colIndex < rows[rowIndex].length; colIndex++) {
        var _column$colspan, _column$rowspan;

        const column = rows[rowIndex][colIndex];
        const colEnd = colStart[rowIndex] + ((_column$colspan = column.colspan) != null ? _column$colspan : 1);
        const rowEnd = rowStart + ((_column$rowspan = column.rowspan) != null ? _column$rowspan : 1);
        const newColumn = { ...column,
          style: {
            'grid-area': `${rowStart} / ${colStart[rowIndex]} / ${rowEnd} / ${colEnd}`
          }
        };
        columnsWithStyle.push(newColumn);

        if (newColumn.id) {
          rowColumns.value.splice(colStart[rowIndex] - 1, 1, newColumn);
        }

        colStart[rowIndex] = colEnd;

        for (let i = 0; i < ((_column$rowspan2 = column.rowspan) != null ? _column$rowspan2 : 0); i++) {
          var _column$rowspan2;

          colStart[rowIndex + i + 1] += 1;
        }
      }

      rowsWithStyle.push(columnsWithStyle);
      rowStart += 1;
    }

    headerRows.value = rowsWithStyle;
  }, {
    immediate: true
  });
  const tableGridStyles = computed(() => ({
    'grid-template-columns': rowColumns.value.map(col => {
      var _col$minWidth, _col$maxWidth;

      return `minmax(${(_col$minWidth = col.minWidth) != null ? _col$minWidth : '150px'}, ${(_col$maxWidth = col.maxWidth) != null ? _col$maxWidth : '1fr'})`;
    }).join(' ')
  }));
  return {
    tableGridStyles,
    rowColumns,
    headerRows
  };
};
export const VDataTableExpandedKey = Symbol.for('vuetify:datatable:expanded');
export const createExpanded = props => {
  const expanded = ref(new Map());

  function toggleExpand(index, item) {
    const isExpanded = expanded.value.has(item.id);

    if (isExpanded) {
      expanded.value.delete(item.id);
    } else {
      expanded.value.set(item.id, index);
    }
  }

  const items = computed(() => {
    const incoming = [...props.items];

    for (const index of expanded.value.values()) {
      incoming.splice(index + 1, 0, {
        [VDataTableExpandedKey]: true
      });
    }

    return incoming;
  });
  provide(VDataTableExpandedKey, {
    toggleExpand
  });
  return {
    items,
    expanded,
    toggleExpand
  };
};
export const useExpanded = () => {
  const data = inject(VDataTableExpandedKey);
  if (!data) throw new Error('foo');
  return data;
};
export const VDataTable = defineComponent({
  name: 'VDataTable',
  props: {
    headers: {
      type: Array,
      required: true
    },
    items: {
      type: Array,
      required: true
    },
    height: [String, Number],
    rowHeight: {
      type: [String, Number],
      default: 48
    },
    stickyHeader: Boolean
  },

  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      rowColumns,
      headerRows,
      tableGridStyles
    } = useHeaders(props);
    const {
      items
    } = createExpanded(props);
    return () => _createVNode("div", {
      "class": "v-data-table",
      "style": {
        height: convertToUnit(props.height)
      }
    }, [_createVNode("table", {
      "class": "v-data-table__table",
      "style": { ...tableGridStyles.value
      },
      "role": "table"
    }, [_createVNode("thead", {
      "class": "v-data-table__thead",
      "role": "rowgroup"
    }, [_createVNode(VDataTableHeaders, {
      "rows": headerRows.value,
      "rowHeight": parseInt(props.rowHeight, 10),
      "sticky": props.stickyHeader
    }, null, 8, ["rows", "rowHeight", "sticky"])]), _createVNode("tbody", {
      "class": "v-data-table__tbody",
      "role": "rowgroup"
    }, [_createVNode(VDataTableRows, {
      "columns": rowColumns.value,
      "items": items.value,
      "rowHeight": parseInt(props.rowHeight, 10)
    }, slots, 8, ["columns", "items", "rowHeight"])])], 4)], 4);
  }

});
//# sourceMappingURL=VDataTable.mjs.map
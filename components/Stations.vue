<template>
  <div class="v-suggestions">
    <input
      v-model="query"
      type="text"
      class="form-control"
      :class="{ 'is-invalid': isInvalid }"
      v-bind="$attrs"
      :autocomplete="Math.random()"
      :placeholder="extendedOptions.placeholder"
      @keydown="onKeyDown"
      @blur="hideItems"
      @focus="onFocus"
    />
    <div
      v-show="showItems === true"
      class="dropdown__wrapper dropdown--country arrow-up"
    >
      <div class="country__wrap-outer">
        <div class="country__wrap-inner">
          <div v-show="items.length" class="country__wrap">
            <ul>
              <li
                v-for="(item, index) in items"
                :key="index"
                :class="{ 'is-active': index === activeItemIndex }"
                @click.prevent="selectItem(index)"
              >
                <a href="javascript:void(0);">{{ item.PlaceName }}</a>
                <span>{{ item.CountryName }}</span>
              </li>
            </ul>
          </div>

          <div
            v-show="!items.length && showItems === true"
            class="c-country__error"
          >
            No match found
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import debounce from 'debounce'

export default {
  inheritAttributes: true,

  props: {
    options: {
      type: Object,
      default: () => ({}),
    },
    onInputChange: {
      type: Function,
      required: true,
    },
    onItemSelected: {
      type: Function,
      default: () => ({}),
    },
    value: {
      type: String,
      required: true,
    },
    isInvalid: {
      type: Boolean,
    },
  },

  data() {
    const defaultOptions = {
      debounce: 0,
      placeholder: '',
      inputClass: 'input',
    }

    const extendedOptions = Object.assign({}, defaultOptions, this.options)

    return {
      extendedOptions,
      query: this.value,
      lastSetQuery: null,
      items: [],
      activeItemIndex: -1,
      showItems: false,
    }
  },

  watch: {
    query(newValue, oldValue) {
      if (newValue === this.lastSetQuery) {
        this.lastSetQuery = null
        return
      }

      this.onQueryChanged(newValue)
      this.$emit('input', newValue)
    },

    value(newValue, oldValue) {
      this.setInputQuery(newValue)
    },
  },

  beforeMount() {
    if (this.extendedOptions.debounce !== 0) {
      this.onQueryChanged = debounce(
        this.onQueryChanged,
        this.extendedOptions.debounce
      )
    }
  },

  methods: {
    onItemSelectedDefault(item) {
      if (typeof item === 'string') {
        this.$emit('input', item)
        this.setInputQuery(item)
        this.showItems = false
      }
    },

    hideItems() {
      setTimeout(() => {
        this.showItems = false
      }, 300)
    },

    showResults() {
      this.showItems = true
    },

    setInputQuery(value) {
      this.lastSetQuery = value
      this.query = value
    },

    onKeyDown(e) {
      this.$emit('keyDown', e.keyCode)

      switch (e.keyCode) {
        case 40:
          this.highlightItem('down')
          e.preventDefault()
          break
        case 38:
          this.highlightItem('up')
          e.preventDefault()
          break
        case 13:
          this.selectItem()
          e.preventDefault()
          break
        case 27:
          this.showItems = false
          e.preventDefault()
          break
        default:
          return true
      }
    },

    selectItem(index) {
      let item = null

      if (typeof index === 'undefined') {
        if (this.activeItemIndex === -1) {
          return
        }

        item = this.items[this.activeItemIndex]
      } else {
        item = this.items[index]
      }

      if (!item) {
        return
      }

      if (this.onItemSelected) {
        this.onItemSelected(item)
      } else {
        this.onItemSelectedDefault(item)
      }

      this.hideItems()
    },

    highlightItem(direction) {
      if (this.items.length === 0) {
        return
      }

      let selectedIndex = this.items.findIndex((item, index) => {
        return index === this.activeItemIndex
      })

      if (selectedIndex === -1) {
        // nothing selected
        if (direction === 'down') {
          selectedIndex = 0
        } else {
          selectedIndex = this.items.length - 1
        }
      } else {
        this.activeIndexItem = 0

        if (direction === 'down') {
          selectedIndex++

          if (selectedIndex === this.items.length) {
            selectedIndex = 0
          }
        } else {
          selectedIndex--

          if (selectedIndex < 0) {
            selectedIndex = this.items.length - 1
          }
        }
      }

      this.activeItemIndex = selectedIndex
    },

    setItems(items) {
      this.items = items
      this.activeItemIndex = -1
      this.showItems = true
    },

    onQueryChanged(value) {
      const result = this.onInputChange(value)
      this.items = []

      if (
        typeof result === 'undefined' ||
        typeof result === 'boolean' ||
        result === null
      ) {
        return
      }

      if (Array.isArray(result)) {
        this.setItems(result)
      } else if (typeof result.then === 'function') {
        result.then((items) => {
          this.setItems(items)
        })
      }
    },

    onFocus() {
      const result = this.onInputChange(this.value.trim())
      this.items = []
      if (
        typeof result === 'undefined' ||
        typeof result === 'boolean' ||
        result === null
      ) {
        return
      }
      if (Array.isArray(result)) {
        this.setItems(result)
      } else if (typeof result.then === 'function') {
        result.then((items) => {
          this.setItems(items)
        })
      }
    },
  },
}
</script>

<style scoped lang="scss">
.dropdown__wrapper {
  padding: 30px;
  background: #fff;
  border: 1px solid #000;
  border-radius: 5px;
  box-shadow: 3px 3px 0 1px #000;
  position: absolute;
  z-index: 99;
  padding: 20px 10px;
  text-align: left;
  width: 200%;

  &.arrow-up {
    top: calc(100% + 10px);

    &:before {
      content: '';
      width: 0;
      height: 0;
      position: absolute;
      z-index: 20;
      top: -9px;
      left: 100px;
      margin-left: -5px;
      border-left: 9px solid transparent;
      border-right: 9px solid transparent;
      border-bottom: 9px solid #fff;
    }

    &:after {
      content: '';
      width: 0;
      height: 0;
      position: absolute;
      top: -10px;
      left: 100px;
      margin-left: -5px;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-bottom: 10px solid #000;
    }
  }
}

.country__wrap-outer {
  max-height: 500px;
  overflow-y: auto;
}
.country__wrap-inner {
  -webkit-column-count: 1;
  -moz-column-count: 1;
  column-count: 1;
}
.country__wrap {
  display: inline-block;
  width: 100%;
  margin-bottom: 0;

  ul {
    padding: 0;
    margin: 0;
    list-style: none;

    li {
      border-bottom: 0.5px solid #ffe900;

      a {
        display: block;
        font-size: 0.875rem;
        color: #000;
        padding: 5px 10px;
        text-decoration: none;
      }

      span {
        margin-left: 10px;
        font-size: 0.8em;
        color: #d4d4d4;
      }

      &:hover {
        cursor: pointer;
        background-color: #000;
        color: #fff !important;

        a {
          background-color: #000;
          color: #fff !important;
        }
      }
    }
  }
}
</style>

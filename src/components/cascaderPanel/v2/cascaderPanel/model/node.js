/*
 * @Description:
 * @LastEditors: HL
 * @LastEditTime: 2020-05-07 19:37:03
 */
let nodeIdSeed = 0

export default class Node {
  constructor (options) {
    this.id = nodeIdSeed++
    this.text = null
    this.checked = false
    this.allChecked = false
    this.data = null
    this.selected = false
    this.parent = null
    this.idPath = null
    this.disabled = false
    this.indeterminate = false
    for (let name in options) {
      if (options.hasOwnProperty(name)) {
        this[name] = options[name]
      }
    }

    // internal
    this.level = 0
    this.childNodes = []

    if (this.parent) {
      this.level = this.parent.level + 1
    }

    const props = this.props

    if (this.data) {
      this.checked = props.checked ? this.data[props.checked] : false
      this.selected = props.selected ? this.data[props.selected] : false
      this.text = this.data[props.label] || this.data[props.labelSpare] || null
      this.disabled = props.disabled ? this.data[props.disabled] : false
      this.indeterminate = props.indeterminate
        ? this.data[props.indeterminate]
        : false
      this.setData(this.data)
    }
  }

  setData (data) {
    this.data = data
    this.childNodes = []

    let children
    if (this.level === 0 && this.data instanceof Array) {
      children = this.data
    } else {
      children = this.data[this.props.children] || []
    }

    for (let i = 0, j = children.length; i < j; i++) {
      this.insertChild({
        data: children[i],
        props: this.props
      })
    }
  }

  insertChild (child) {
    if (!child) throw new Error('insertChild error: child is required.')

    if (!(child instanceof Node)) {
      // 遍历时保存父节点
      Object.assign(child, {
        parent: this
      })
      child = new Node(child)
    }
    if (this.idPath || this.idPath === 0) {
      let tmp = this.idPath.split(',')
      tmp.push(this.id)
      child.idPath = tmp.join(',')
    } else {
      child.idPath = this.id + ''
    }

    child.level = this.level + 1
    this.childNodes.push(child)
  }

  setDataByNode (data, node, refresh) {
    if (refresh) {
      node.childNodes = []
    } else {
      if (!(node.childNodes && node.childNodes.length)) {
        node.childNodes = []
      } else {
        return
      }
    }
    // node.data = data;
    let children
    if (data instanceof Array) {
      children = data
    } else {
      children = data[this.props.children] || []
    }
    for (let i = 0, j = children.length; i < j; i++) {
      this.insertChild.call(node, {
        data: children[i],
        props: this.props
      })
    }
  }
}

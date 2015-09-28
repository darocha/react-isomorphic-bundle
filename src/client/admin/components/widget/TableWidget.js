import React, { PropTypes } from 'react'
import { isEmpty, contains, without } from 'lodash'
import classNames from 'classnames'
import { toDate } from 'shared/utils/date-utils'
import {
  Pagination
} from 'client/admin/components/widget'

if (process.env.BROWSER) {
}

export default class TableWidget extends React.Component {

  static propTypes = {
    collect: PropTypes.object.isRequired,
    action: PropTypes.func.isRequired,
    selected: PropTypes.number
  }

  static defaultProps = {
    selected: 0
  }

  constructor (props) {
    super(props)

    this.state = { checked: [], page: 1 }
  }

  handleChange (id, e) {
    let checked = this.state.checked
    if (e.target.checked) {
      if (!contains(checked, id)) {
        checked.push(id)
        this.setState({ checked: checked })
      }
    } else {
      if (contains(checked, id)) {
        checked = without(checked, id)
      }
      this.setState({ checked: checked })
    }
  }

  handleClick () {
    const checked = this.state.checked

    this.props.action(checked, this.state.page).then(() => {
      this.setState({ checked: [] })
    })
  }

  isChecked (id) {
    return contains(this.state.checked, id)
  }

  renderActionBtn () {
    const ActionBtnClasses = classNames(
      'ui',
      {'red': !this.props.selected },
      {'green': this.props.selected },
      'button',
      {'loading': !this.props.collect.done },
      {'disabled': isEmpty(this.state.checked) }
    )
    const btnLabel = (!this.props.selected) ? '標記垃圾' : '還原佈告'
    return (
      <div
        onClick={::this.handleClick}
        className={ActionBtnClasses}>
        { btnLabel }
      </div>
    )
  }

  render () {
    const { items } = this.props.collect
    const handleChange = ::this.handleChange
    const isChecked = ::this.isChecked

    const TableClasses = classNames(
      'ui',
      'definition',
      'compact',
      'stackable',
      'striped',
      'table'
    )

    return (
      <table className={TableClasses}>
        <thead className="full-width">
          <tr>
            <th></th>
            <th className="table title">標題</th>
            <th className="table date">發文日期</th>
            <th className="table email">發文者</th>
          </tr>
        </thead>
        <tbody>
        {!isEmpty(items) && items.map(function(item, i) {
          const checked = isChecked(item.id)
          return (
          <tr>
            <td className="collapsing">
              <div className="ui checkbox">
                <input
                  type="checkbox"
                  defaultChecked="false"
                  checked={checked}
                  onChange={handleChange.bind(this, item.id)} />
                <label></label>
              </div>
            </td>
            <td className="table title">
              { (checked)
                && (<a className="delete" target="_blank" href={`../w/p/${item.id}`}>
                  { item.title }
                </a>)
              }
              { (!checked)
                && (<a target="_blank" href={`../w/p/${item.id}`}>
                  { item.title }
                </a>)
              }
            </td>
            <td className="table date">{ toDate(item.created_at, true) }</td>
            <td className="table email">{ item['user.email'] }</td>
          </tr>
          )
        })}
        </tbody>
        <tfoot className="full-width">
          <tr>
            <th colSpan="5">
              {::this.renderActionBtn()}
              <Pagination {...this.props} />
            </th>
          </tr>
        </tfoot>
      </table>
    )
  }
}


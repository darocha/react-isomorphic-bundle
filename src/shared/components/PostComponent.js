import React, { PropTypes } from 'react'
import BaseComponent from 'shared/components/BaseComponent'
import { Form, PostForm, PostFormOptions } from 'shared/utils/forms'
import { isEmpty, clone } from 'lodash'
import classNames from 'classnames'
import moment from 'moment'
const { CSSTransitionGroup } = React.addons

export default class Post extends BaseComponent {

  constructor (props) {
    super(props)
    const today = moment().format('YYYY-M-D').split('-')
    today[1] = today[1] - 1
    this.state = {
      value: {
        type: '2',
        prop: '1',
        startDate: today,
        endDate: today,
        title: null,
        content: null
      },
      options: PostFormOptions,
      submited: false,
      updated: false
    }

    this._bind('handleSubmit', 'validation', 'handleChange')
  }

  static propTypes = {
    submit: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  handleChange () {}

  handleSubmit (evt) {
    evt.preventDefault()

    let value = this.refs.form.getValue()

    if (value) {
      let saved = clone(value)
      this.setState({ value: saved })
      this.setState({ submited: true })

      setTimeout(() => this.props.submit(value), 1000)
    }
  }

  clearFormErrors () {
    let options = clone(this.state.options)
    options.fields = clone(options.fields)

    for (let key in options.fields) {
      options.fields[key] = clone(options.fields[key])
      if (options.fields[key].hasOwnProperty('hasError'))
        options.fields[key].hasError = false
    }
    this.setState({ options: options })
  }

  validation (errors) {
    if (!isEmpty(errors)) {
      let options = clone(this.state.options)
      options.fields = clone(options.fields)

      errors.map(function (err) {
        if (err.code === 'invalid') {
          options.fields[err.field] = clone(options.fields[err.field])
          options.fields[err.field] = { hasError: true, error: err.message }
        }
        else {
          options.fields[err.path] = clone(options.fields[err.path])
          options.fields[err.path] = { hasError: true, error: err.message }
        }
      })
      this.setState({ submited: false })
      this.setState({ options: options })
    }
  }

  checkSubmited (content) {
    if (!isEmpty(content)) {
      this.setState({ submited: true })

      if (content.uid)
        this.setState({ updated: true, submited: true })

      setTimeout(() => this.context.router.transitionTo('/wall'), 2000)
    }
  }

  componentWillReceiveProps (nextProps) {
    this.validation(nextProps.post.errors)
    this.checkSubmited(nextProps.post.content)
  }

  render () {
    let Loading = this.state.submited
      && !this.state.updated
      ? classNames('ui', 'form', 'segment', 'loading')
      : classNames('ui', 'form', 'segment')

    let Message = this.state.updated ?
    (
      <div className="ui success message">
        <div className="header">
          Post created!
        </div>
        <p>now will redirect to homepage.</p>
      </div>
    ) : null

    return (
      <main className="ui two column stackable centered page grid">
        <div className="column">
          <CSSTransitionGroup transitionName="MessageTransition">
            {Message}
          </CSSTransitionGroup>
          <form
            className={Loading}
            action="/posts/new"
            method="post"
            onSubmit={this.handleSubmit}
          >
            <Form
              ref="form"
              type={PostForm}
              options={this.state.options}
              value={this.state.value}
              onChange={this.handleChange}
            />
            <div className="ui hidden divider" />
            <button
              type="submit"
              className="ui red labeled icon large button"
              disabled={this.state.submited}
            >
              Post it!
              <i className="add icon"></i>
            </button>
          </form>
        </div>
      </main>
    )
  }
}

import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import Modal from 'react-modal'

import { getWebAccountTypes } from '../../utils'

function mapStateToProps(state) {
  return {
    api: state.settings.api
  }
}

class SocialAccountItem extends Component {
  static propTypes = {
    listItem: PropTypes.bool.isRequired,
    service: PropTypes.string.isRequired,
    identifier: PropTypes.string.isRequired,
    proofUrl: PropTypes.string,
    verified: PropTypes.bool,
    api: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    this.getAccountUrl = this.getAccountUrl.bind(this)
    this.getIconClass = this.getIconClass.bind(this)
    this.getIdentifier = this.getIdentifier.bind(this)
  }

  getAccountUrl() {
    const webAccountTypes = getWebAccountTypes(this.props.api)
    let accountUrl = `http://${this.props.service}.com/${this.props.identifier}`
    if (webAccountTypes.hasOwnProperty(this.props.service)) {
      if (webAccountTypes[this.props.service].hasOwnProperty('urlTemplate')) {
        let urlTemplate = webAccountTypes[this.props.service].urlTemplate
        if (urlTemplate) {
          accountUrl = urlTemplate.replace('{identifier}', this.props.identifier)
        }
      }
    }
    return accountUrl
  }

  getIconClass() {
    const webAccountTypes = getWebAccountTypes(this.props.api)
    let iconClass = ''
    if (webAccountTypes.hasOwnProperty(this.props.service)) {
      iconClass = webAccountTypes[this.props.service].iconClass
    }
    return iconClass
  }

  getIdentifier() {
    let identifier = this.props.identifier
    if (identifier.length >= 15) {
      identifier = identifier.slice(0, 15) + '...'
    }
    return identifier
  }

  render() {
    const webAccountTypes = getWebAccountTypes(this.props.api)
    if (webAccountTypes[this.props.service]) {
      if (this.props.listItem === true) {
        return (
          <li className={!this.props.verified ? "verified" : "pending"}>
            <a href={this.getAccountUrl()} data-toggle="tooltip"
              title={webAccountTypes[this.props.service].label}>
              {this.props.verified ?
              <span className="">
                <i className="fa fa-fw fa-check fa-green" />
                <i className={`fa fa-fw ${this.getIconClass()} fa-lg`} />
              </span>
              :
              <span className="">
                <i className="fa fa-fw">&nbsp;</i>
                <i className={`fa fa-fw ${this.getIconClass()} fa-lg`} />
              </span>
              }
              <span className="app-account-identifier">
                {this.getIdentifier()}
              </span>
              <span className="app-account-service">
                {`@${this.props.service}`}
              </span>
            </a>
          </li>
        )
      } else {
        return (
          <span>
            <i className={`fa ${this.getIconClass()}`} />
            <span>{this.getIdentifier()}</span>
          </span>
        )
      }
    } else {
      return (
        <span>
        </span>
      )
    }
  }
}

export default connect(mapStateToProps, null)(SocialAccountItem)

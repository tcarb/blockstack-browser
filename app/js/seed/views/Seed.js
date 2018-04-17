import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { PanelCard, PanelCardHeader } from '@components/PanelShell'
import { Button, Buttons } from '@components/styled/Button'
import { Transition } from 'react-spring'

import styled from 'styled-components'

const Word = styled.h5`
  font-size: 24px;
  font-weight: bold;
  padding: 0 10px;
  margin-bottom: 0;
  text-transform: capitalize;
`

const Line = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 28px;
  width: 200px;
  position: relative;
`

const Number = styled.div`
  font-size: 14px;
  opacity: 0.5;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Words = styled.div`
  display: flex;
  flex-direction: column;
`

const HiddenInput = styled.input`
  opacity: 0;
  position: absolute;
  pointer-events: none;
`

class Seed extends React.Component {
  state = {
    copied: false
  }

  copySeed = () => {
    const copyText = document.querySelector('#copy-seed')
    copyText.select()
    document.execCommand('copy')
    this.setState({
      copied: true
    })
    setTimeout(() => {
      if (this.state.copied) {
        this.setState({
          copied: false
        })
      }
    }, 1800)
  }

  render() {
    const {
      next,
      previous,
      seed = [],
      completeSeed = ' ',
      set,
      ...rest
    } = this.props
    if (!seed || !seed.length || seed === null) {
      return null
    }
    const multiplier = () => {
      switch (set) {
        case 2:
          return 5
        case 3:
          return 9
        default:
          return 1
      }
    }

    return (
      <PanelCard
        renderHeader={() => (
          <PanelCardHeader
            title={
              <span>
                Your secret recovery seed.<br />
                <h6>Write down all words, in order.</h6>
              </span>
            }
            pt={4}
          />
        )}
        {...rest}
      >
        <Fragment>
          <HiddenInput id="copy-seed" value={completeSeed} />
          <PanelCard.Section pt={0} lineHeight={3}>
            <Words>
              {seed.length > 1 ? (
                <Transition
                  from={{
                    opacity: 0,
                    top: 20
                  }}
                  leave={{
                    opacity: 0,
                    top: 20
                  }}
                  enter={{
                    opacity: 1,
                    top: 0
                  }}
                  keys={seed.map(item => item)}
                >
                  {seed.map((item, i) => styles => (
                    <Line key={item} style={styles}>
                      <Number>#{i + multiplier()}</Number> <Word>{item}</Word>
                    </Line>
                  ))}
                </Transition>
              ) : null}
            </Words>
          </PanelCard.Section>
          <PanelCard.Section pt={3}>
            <Buttons>
              <Button onClick={previous} secondary>
                Back
              </Button>
              <Button onClick={next} primary>
                Next
              </Button>
            </Buttons>
            <Buttons center pt={4}>
              <Button onClick={() => this.copySeed()} secondary small>
                {this.state.copied ? 'Copied!' : 'Copy Entire Seed'}
              </Button>
            </Buttons>
          </PanelCard.Section>
        </Fragment>
      </PanelCard>
    )
  }
}

Seed.propTypes = {
  next: PropTypes.func.isRequired,
  previous: PropTypes.func.isRequired
}

export default Seed

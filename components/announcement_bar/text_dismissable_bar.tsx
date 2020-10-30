// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import {trackEvent} from 'actions/telemetry_actions.jsx';
import Markdown from 'components/markdown';

import AnnouncementBar from './default_announcement_bar';

type Props = {
    allowDismissal: boolean,
    onDismissal?: () => void,
    text: string,
    [key: string]: unknown,
}

type State = {
    dismissed: boolean,
}

const localStoragePrefix = '__announcement__';

export default class TextDismissableBar extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            dismissed: true,
        };
    }

    public static getDerivedStateFromProps(props: Props) {
        const dismissed = localStorage.getItem(localStoragePrefix + props.text);
        return {
            dismissed,
        };
    }

    public handleDismiss = () => {
        if (!this.props.allowDismissal) {
            return;
        }
        trackEvent('signup', 'click_dismiss_bar');

        localStorage.setItem(localStoragePrefix + this.props.text, 'true');
        this.setState({
            dismissed: true,
        });
        if (this.props.onDismissal) {
            this.props.onDismissal();
        }
    }

    public render() {
        if (this.state.dismissed) {
            return null;
        }
        const {allowDismissal, text, ...extraProps} = this.props;
        return (
            <AnnouncementBar
                {...extraProps}
                showCloseButton={allowDismissal}
                handleClose={this.handleDismiss}
                message={
                    <Markdown
                        message={text}
                        options={{
                            singleline: true,
                            mentionHighlight: false,
                        }}
                    />
                }
            />
        );
    }
}


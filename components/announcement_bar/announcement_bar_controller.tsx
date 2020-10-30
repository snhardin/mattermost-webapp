// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import ConfigurationAnnouncementBar from './configuration_bar';
import VersionBar from './version_bar';
import TextDismissableBar from './text_dismissable_bar';
import AnnouncementBar from './default_announcement_bar';

import CloudAnnouncementBar from './cloud_announcement_bar';
import PaymentAnnouncementBar from './payment_announcement_bar';
import { ClientConfig } from 'mattermost-redux/types/config';
import { AnalyticsRow } from 'mattermost-redux/src/types/admin';

type Props = {
    license: any,
    config?: Partial<ClientConfig>,
    user?: {
        email: string,
        email_verified?: boolean,
    },
    canViewSystemErrors: boolean,
    latestError?: { [key: string]: any },
    totalUsers?: number | AnalyticsRow[],
    warnMetricsStatus: any,
    actions: {
        dismissError: () => void,
    },
}

export default class AnnouncementBarController extends React.PureComponent<Props> {
    public render() {
        let adminConfiguredAnnouncementBar = null;
        if (this.props.config?.EnableBanner === 'true' && this.props.config?.BannerText?.trim()) {
            adminConfiguredAnnouncementBar = (
                <TextDismissableBar
                    color={this.props.config.BannerColor}
                    textColor={this.props.config.BannerTextColor}
                    allowDismissal={this.props.config.AllowBannerDismissal === 'true'}
                    text={this.props.config.BannerText}
                />
            );
        }

        let errorBar = null;
        if (this.props.latestError) {
            errorBar = (
                <AnnouncementBar
                    type={this.props.latestError.error.type}
                    message={this.props.latestError.error.message}
                    showCloseButton={true}
                    handleClose={this.props.actions.dismissError}
                />
            );
        }
        let cloudAnnouncementBar = null;
        let paymentAnnouncementBar = null;
        if (this.props.license.Cloud === 'true') {
            cloudAnnouncementBar = (
                <CloudAnnouncementBar/>
            );
            paymentAnnouncementBar = (
                <PaymentAnnouncementBar/>
            );
        }

        return (
            <React.Fragment>
                {adminConfiguredAnnouncementBar}
                {errorBar}
                {cloudAnnouncementBar}
                {paymentAnnouncementBar}
                <VersionBar/>
                <ConfigurationAnnouncementBar
                    config={this.props.config}
                    license={this.props.license}
                    canViewSystemErrors={this.props.canViewSystemErrors}
                    totalUsers={this.props.totalUsers}
                    user={this.props.user}
                    warnMetricsStatus={this.props.warnMetricsStatus}
                />
            </React.Fragment>
        );
    }
}

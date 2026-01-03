import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Textarea,
  TextInput,
  Select,
  Option,
  Grid,
  GridItem,
  Tabs,
  Tab,
  TabGroup,
  TabPanels,
  TabPanel,
} from '@strapi/design-system';
import { Mail, Message, Share, Calendar } from '@strapi/icons';
import { request } from '@strapi/helper-plugin';

const MarketingHub = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Email state
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');

  // SMS state
  const [smsPhone, setSmsPhone] = useState('');
  const [smsMessage, setSmsMessage] = useState('');

  // Social state
  const [socialContent, setSocialContent] = useState('');
  const [socialPlatforms, setSocialPlatforms] = useState(['instagram']);

  const sites = [
    { value: '1', label: 'Mayhemworld' },
    { value: '2', label: 'ShotByMayhem' },
    { value: '3', label: 'Goddesses of ATL' },
    { value: '4', label: 'Nexus AI' },
  ];

  const [selectedSite, setSelectedSite] = useState('2');

  const sendEmail = async () => {
    setLoading(true);
    try {
      const response = await request('/marketing/send-email', {
        method: 'POST',
        body: {
          to: emailTo,
          subject: emailSubject,
          html: `<p>${emailContent}</p>`,
          site_id: parseInt(selectedSite),
        },
      });
      setResult('✅ Email sent successfully!');
    } catch (error) {
      setResult('❌ Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const sendSMS = async () => {
    setLoading(true);
    try {
      const response = await request('/marketing/send-sms', {
        method: 'POST',
        body: {
          to: smsPhone,
          body: smsMessage,
          site_id: parseInt(selectedSite),
        },
      });
      setResult('✅ SMS sent successfully!');
    } catch (error) {
      setResult('❌ Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const postToSocial = async () => {
    setLoading(true);
    try {
      const response = await request('/marketing/post-social', {
        method: 'POST',
        body: {
          content: socialContent,
          platforms: socialPlatforms,
          site_id: parseInt(selectedSite),
        },
      });
      setResult('✅ Posted to social media!');
    } catch (error) {
      setResult('❌ Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box padding={8}>
      <Box marginBottom={4}>
        <Typography variant="alpha">Marketing Hub</Typography>
        <Typography variant="omega" textColor="neutral600">
          Send emails, SMS, and social media posts across all your sites
        </Typography>
      </Box>

      <Grid gap={4}>
        <GridItem col={12}>
          <Select label="Site" value={selectedSite} onChange={setSelectedSite}>
            {sites.map(site => (
              <Option key={site.value} value={site.value}>
                {site.label}
              </Option>
            ))}
          </Select>
        </GridItem>

        <GridItem col={12}>
          <TabGroup
            label="Marketing Channels"
            id="tabs"
            onTabChange={setActiveTab}
            variant="simple"
          >
            <Tabs>
              <Tab>
                <Mail /> Email
              </Tab>
              <Tab>
                <Message /> SMS
              </Tab>
              <Tab>
                <Share /> Social Media
              </Tab>
            </Tabs>

            <TabPanels>
              {/* Email Tab */}
              <TabPanel>
                <Box padding={4}>
                  <Grid gap={4}>
                    <GridItem col={12}>
                      <TextInput
                        label="Recipient Email"
                        placeholder="user@example.com"
                        value={emailTo}
                        onChange={(e) => setEmailTo(e.target.value)}
                      />
                    </GridItem>
                    <GridItem col={12}>
                      <TextInput
                        label="Subject"
                        placeholder="Your email subject..."
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                      />
                    </GridItem>
                    <GridItem col={12}>
                      <Textarea
                        label="Message"
                        placeholder="Your email content..."
                        value={emailContent}
                        onChange={(e) => setEmailContent(e.target.value)}
                        rows={6}
                      />
                    </GridItem>
                    <GridItem col={12}>
                      <Button
                        onClick={sendEmail}
                        loading={loading}
                        disabled={!emailTo || !emailSubject || !emailContent}
                      >
                        Send Email
                      </Button>
                    </GridItem>
                  </Grid>
                </Box>
              </TabPanel>

              {/* SMS Tab */}
              <TabPanel>
                <Box padding={4}>
                  <Grid gap={4}>
                    <GridItem col={12}>
                      <TextInput
                        label="Phone Number"
                        placeholder="+1234567890"
                        value={smsPhone}
                        onChange={(e) => setSmsPhone(e.target.value)}
                      />
                    </GridItem>
                    <GridItem col={12}>
                      <Textarea
                        label="Message"
                        placeholder="Your SMS message..."
                        value={smsMessage}
                        onChange={(e) => setSmsMessage(e.target.value)}
                        rows={4}
                      />
                    </GridItem>
                    <GridItem col={12}>
                      <Button
                        onClick={sendSMS}
                        loading={loading}
                        disabled={!smsPhone || !smsMessage}
                      >
                        Send SMS
                      </Button>
                    </GridItem>
                  </Grid>
                </Box>
              </TabPanel>

              {/* Social Media Tab */}
              <TabPanel>
                <Box padding={4}>
                  <Grid gap={4}>
                    <GridItem col={12}>
                      <Textarea
                        label="Post Content"
                        placeholder="What do you want to share?"
                        value={socialContent}
                        onChange={(e) => setSocialContent(e.target.value)}
                        rows={6}
                      />
                    </GridItem>
                    <GridItem col={12}>
                      <Typography variant="omega">
                        Platforms: Instagram, Twitter, Facebook
                      </Typography>
                    </GridItem>
                    <GridItem col={12}>
                      <Button
                        onClick={postToSocial}
                        loading={loading}
                        disabled={!socialContent}
                      >
                        Post to Social Media
                      </Button>
                    </GridItem>
                  </Grid>
                </Box>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </GridItem>

        {result && (
          <GridItem col={12}>
            <Box
              padding={4}
              background="neutral100"
              borderRadius="4px"
              marginTop={4}
            >
              <Typography variant="omega">{result}</Typography>
            </Box>
          </GridItem>
        )}
      </Grid>
    </Box>
  );
};

export default MarketingHub;

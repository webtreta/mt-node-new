// public/plans-data.js

const plans = [
    {
        name: 'Free',
        originalPrice: '$0.00',
        price: '$0',
        tempPrice: 0,
        discount: '100% OFF',
        buttonText: 'Download',
        features: [
            {
                title: 'Preset Saving',
                subtitles: [
                    {
                        text: 'Up to 5 presets',
                    }
                ]
            },
            {
                title: 'Customer Support',
                subtitles: [
                    {
                        text: 'Standard Support (1-2 Weeks Response Time)',
                    }
                ]
            },
            {
                title: 'Token Management System',
                subtitles: [
                    {
                        text: 'Generate Token to Use MT Auto Clicker',
                    }
                ]
            },
            {
                title: 'Ads',
                subtitles: [
                    {
                        text: 'Ad-Supported Experience',
                    }
                ]
            },
            {
                title: 'Multi-Platform Availability',
                subtitles: [
                    {
                        text: 'Available across all major platforms',
                        items: [
                            'Windows (Desktop)',
                            'macOS (Desktop)',
                            'Android (Mobile/Tablet)',
                            'iOS (iPhone/iPad)',
                            'Web-based version'
                        ]
                    },
                    {
                        text: 'Unified Access',
                        items: [
                            'Single subscription works across all platforms',
                            'Seamless transition between devices',
                            'Consistent user interface across platforms'
                        ]
                    }
                ]
            }
        ]
    },
    {
        name: 'Yearly',
        originalPrice: '$9.99',
        price: '$3.99',
        tempPrice: 3.99,
        discount: '60% OFF',
        buttonText: 'Upgrade',
        isBestValue: true,
        features: [
            {
                title: 'Preset Saving',
                subtitles: [
                    {
                        text: 'Unlimited presets',
                    },
                    {
                        text: 'Cloud backup (Coming Soon)',
                    }
                ]
            },
            {
                title: 'Customer Support',
                subtitles: [
                    {
                        text: 'VIP Support (Response within hours)',
                    },
                    {
                        text: 'Priority issue resolution',
                    },
                    {
                        text: 'Direct access to support team',
                    }
                ]
            },
            {
                title: 'Ad-Free Experience',
                subtitles: [
                    {
                        text: 'No advertisements',
                    },
                    {
                        text: 'Uninterrupted automation',
                    }
                ]
            }
            // Add other features as needed
        ]
    },
    {
        name: 'Lifetime',
        originalPrice: '$75.87',
        price: '$19.99',
        tempPrice: 19.99,
        discount: '60% OFF',
        buttonText: 'Upgrade',
        features: [
            {
                title: 'Preset Saving',
                subtitles: [
                    {
                        text: 'Unlimited presets',
                    },
                    {
                        text: 'Cloud backup (Coming Soon)',
                    }
                ]
            },
            {
                title: 'Customer Support',
                subtitles: [
                    {
                        text: 'VIP Support (Response within hours)',
                    },
                    {
                        text: 'Priority issue resolution',
                    },
                    {
                        text: 'Direct access to support team',
                    }
                ]
            },
            {
                title: 'Ad-Free Experience',
                subtitles: [
                    {
                        text: 'No advertisements',
                    },
                    {
                        text: 'Uninterrupted automation',
                    }
                ]
            }
            // Add other features as needed
        ]
    }
];

// For browser environment
if (typeof window !== 'undefined') {
    window.plans = plans;
}

// For Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = plans;
}
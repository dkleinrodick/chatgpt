document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    
    // Letter generation and delivery system
    const letterSystem = {
        // Email delivery functionality
        sendEmail: function(recipient, subject, letterData, plan) {
            console.log(`Email would be sent to ${recipient} with subject: ${subject}`);
            
            // In a real implementation, this would connect to an email API
            return {
                success: true,
                messageId: 'msg_' + Math.random().toString(36).substr(2, 9),
                sentAt: new Date().toISOString()
            };
        },
        
        // Generate letter using Anthropic AI
        generateLetter: async function(letterType, details, plan) {
            console.log(`Generating ${letterType} letter with ${plan} plan using Anthropic AI`);
            
            try {
                // Call Anthropic API to generate the letter
                const anthropicResponse = await this.callAnthropicAPI(letterType, details);
                
                // Format the letter based on plan (plain text, professional letterhead)
                const formattedLetter = this.formatLetter(anthropicResponse.content, plan);
                
                // For attorney review, this would queue the letter for attorney review
                if (plan === 'attorney') {
                    console.log('Letter will also be sent to an attorney for review');
                    // In production, this would add the letter to a queue for attorney review
                }
                
                return {
                    success: true,
                    letterContent: formattedLetter,
                    letterTitle: this.getLetterTitle(letterType, details),
                    generatedAt: new Date().toISOString(),
                    wordDocumentUrl: this.getWordDocumentUrl(letterType, plan),
                    aiGenerated: true
                };
            } catch (error) {
                console.error('Error generating letter with Anthropic:', error);
                
                // Fallback to template if AI fails
                return this.generateTemplateLetterFallback(letterType, details, plan);
            }
        },
        
        // Call Anthropic API to generate letter
        callAnthropicAPI: async function(letterType, details) {
            const API_KEY = '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';
            const API_URL = 'https://api.anthropic.com/v1/messages';
            
            // Convert letter type to a more readable format
            const readableLetterType = letterType.replace(/-/g, ' ');
            
            // Build the context based on letter type and details
            let context = `You are drafting a formal demand letter for a ${readableLetterType} dispute.\n\n`;
            
            // Add relevant details based on letter type
            switch(letterType) {
                case 'unpaid-invoice':
                    context += `
This is an unpaid invoice demand letter with the following details:
- Sender: ${details.senderName} (${details.senderAddress})
- Recipient: ${details.recipientName} (${details.recipientAddress})
- Invoice Number: ${details.invoiceNumber}
- Invoice Date: ${details.invoiceDate}
- Invoice Amount: $${details.invoiceAmount}
- Services Provided: ${details.serviceDescription}
- Payment Due Date: ${details.paymentDueDate}
- Preferred Payment Method: ${details.paymentMethod}
${details.additionalInfo ? `- Additional Information: ${details.additionalInfo}` : ''}
`;
                    break;
                case 'security-deposit':
                    context += `
This is a security deposit return demand letter with the following details:
- Tenant: ${details.tenantName} (${details.tenantAddress})
- Landlord: ${details.landlordName} (${details.landlordAddress})
- Property Address: ${details.propertyAddress}
- Lease Start Date: ${details.leaseStartDate}
- Lease End Date: ${details.leaseEndDate}
- Security Deposit Amount: $${details.depositAmount}
${details.reasonForWithholding ? `- Landlord's Reason for Withholding: ${details.reasonForWithholding}` : ''}
- Tenant's Dispute Reason: ${details.disputeReason}
${details.additionalInfo ? `- Additional Information: ${details.additionalInfo}` : ''}
`;
                    break;
                case 'defective-product':
                    context += `
This is a defective product demand letter with the following details:
- Consumer: ${details.consumerName} (${details.consumerAddress})
- Company: ${details.companyName} (${details.companyAddress})
- Product: ${details.productName}
- Purchase Date: ${details.purchaseDate}
- Purchase Price: $${details.purchasePrice}
- Defect Description: ${details.defectDescription}
- Previous Resolution Attempts: ${details.attemptedResolution}
- Requested Resolution: ${details.requestedResolution}
${details.additionalInfo ? `- Additional Information: ${details.additionalInfo}` : ''}
`;
                    break;
                case 'contractor-dispute':
                    context += `
This is a contractor dispute demand letter with the following details:
- Property Owner: ${details.ownerName} (${details.ownerAddress})
- Contractor: ${details.contractorName} (${details.contractorAddress})
- Project Location: ${details.projectLocation}
- Contract Date: ${details.contractDate}
- Contract Amount: $${details.contractAmount}
- Project Description: ${details.projectDescription}
- Dispute Description: ${details.disputeDescription}
- Amount in Dispute: $${details.amountInDispute}
- Requested Resolution: ${details.requestedResolution}
${details.additionalInfo ? `- Additional Information: ${details.additionalInfo}` : ''}
`;
                    break;
                case 'personal-loan':
                    context += `
This is a personal loan repayment demand letter with the following details:
- Lender: ${details.lenderName} (${details.lenderAddress})
- Borrower: ${details.borrowerName} (${details.borrowerAddress})
- Loan Date: ${details.loanDate}
- Original Loan Amount: $${details.loanAmount}
- Amount Repaid: $${details.amountRepaid}
- Outstanding Amount: $${details.amountOutstanding}
${details.dueDate ? `- Original Due Date: ${details.dueDate}` : ''}
${details.interestRate ? `- Interest Rate: ${details.interestRate}%` : ''}
- Loan Terms: ${details.loanTerms}
- Repayment Request Details: ${details.repaymentRequest}
${details.additionalInfo ? `- Additional Information: ${details.additionalInfo}` : ''}
`;
                    break;
                case 'other-dispute':
                    context += `
This is a general dispute demand letter with the following details:
- Sender: ${details.senderName} (${details.senderAddress})
- Recipient: ${details.recipientName} (${details.recipientAddress})
- Relationship Context: ${details.relationshipContext}
- Dispute Type: ${details.disputeType}
- Dispute Description: ${details.disputeDescription}
- Relevant Dates: ${details.relevantDates}
${details.amountInDispute ? `- Amount in Dispute: $${details.amountInDispute}` : ''}
- Requested Resolution: ${details.requestedResolution}
${details.additionalInfo ? `- Additional Information: ${details.additionalInfo}` : ''}
`;
                    break;
                default:
                    context += `
This is a general demand letter with the following details:
- Sender: ${details.senderName} (${details.senderAddress})
- Recipient: ${details.recipientName} (${details.recipientAddress})
- Subject: ${details.disputeSubject}
- Description: ${details.disputeDescription}
- Requested Action: ${details.requestedAction}
- Timeframe: ${details.timeframe}
${details.additionalInfo ? `- Additional Information: ${details.additionalInfo}` : ''}
`;
            }
            
            // Add instruction for the AI
            const systemPrompt = `You are an expert legal document drafter. You're creating a formal demand letter that's professional, detailed, and persuasive. Include current date, addresses, a clear explanation of the dispute, specific demands for resolution, a deadline, and consequences for non-compliance. Format as a standard business letter with proper spacing between sections. Do not include any placeholders or <text> markers. Use tone that is firm but not aggressive.`;
            
            // Format the prompt
            const userPrompt = `${context}\n\nDraft a complete, formal demand letter using the information above. Follow standard business letter format. Include all necessary dates, addresses, details, and make it sound professional and legally appropriate. The letter should be ready to print and send as is.`;
            
            // Make an actual API call to Anthropic
            console.log('Sending request to Anthropic API...');
            
            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': API_KEY,
                        'anthropic-version': '2023-06-01'
                    },
                    body: JSON.stringify({
                        model: 'claude-3-opus-20240229',
                        max_tokens: 4000,
                        system: systemPrompt,
                        messages: [
                            {
                                role: 'user',
                                content: userPrompt
                            }
                        ]
                    })
                });
                
                if (!response.ok) {
                    throw new Error(`API request failed with status ${response.status}`);
                }
                
                const data = await response.json();
                console.log('Anthropic API response received successfully.');
                
                return {
                    success: true,
                    content: data.content[0].text,
                    metadata: {
                        model: data.model,
                        tokens: data.usage.output_tokens
                    }
                };
                
            } catch (error) {
                console.error('Error calling Anthropic API:', error);
                
                // Fallback to template-based content if API call fails
                console.log('Falling back to template-based letter...');
                
                const today = new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                
                let fallbackContent = '';
                
                if (letterType === 'unpaid-invoice') {
                    fallbackContent = `${today}

${details.recipientName}
${details.recipientAddress}

RE: DEMAND FOR PAYMENT - INVOICE #${details.invoiceNumber}

Dear ${details.recipientName},

I am writing to formally demand payment for services rendered as outlined in Invoice #${details.invoiceNumber} dated ${details.invoiceDate} in the amount of $${details.invoiceAmount}.

I provided ${details.serviceDescription} as agreed upon in our contract. The payment for these services was due on ${details.paymentDueDate}, which has now passed without receipt of payment. Despite several attempts to resolve this matter informally, the invoice remains unpaid.

Please remit payment in full in the amount of $${details.invoiceAmount} via ${details.paymentMethod} within 10 days of receiving this letter, no later than ${new Date(new Date().setDate(new Date().getDate() + 10)).toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})}.

If payment is not received by this date, I will have no choice but to pursue all available legal remedies to collect the debt, including but not limited to:

1. Filing a claim in small claims court
2. Reporting the unpaid debt to relevant credit bureaus
3. Seeking recovery of the principal amount plus interest, court costs, filing fees, and any applicable attorney's fees

I trust that you will address this matter promptly so that we can resolve it amicably without further legal action. If you have already sent payment or believe this demand is in error, please contact me immediately to resolve any misunderstanding.

Sincerely,

${details.senderName}
${details.senderAddress}`;
                } else if (letterType === 'security-deposit') {
                    fallbackContent = `${today}

${details.landlordName}
${details.landlordAddress}

RE: DEMAND FOR RETURN OF SECURITY DEPOSIT

Dear ${details.landlordName},

I am writing to formally request the return of my security deposit in the amount of $${details.depositAmount} for the property I rented at ${details.propertyAddress}. My tenancy began on ${details.leaseStartDate} and ended on ${details.leaseEndDate} when I vacated the premises.

As required by the terms of our lease agreement, I have fulfilled all of my obligations as a tenant. I vacated the property on the agreed-upon date, returned all keys, and left the property in clean and undamaged condition, with the exception of normal wear and tear permitted by law.

${details.reasonForWithholding ? `You have claimed that "${details.reasonForWithholding}" justifies withholding a portion of my security deposit. I dispute this claim because ${details.disputeReason}.` : `To date, I have not received my security deposit refund or an itemized statement accounting for any deductions.`}

Under state law, landlords are typically required to return security deposits within 14-30 days after a tenant vacates the property. This deadline has now passed.

Please remit the full amount of $${details.depositAmount} to me at my current address listed below within 10 days of receiving this letter, no later than ${new Date(new Date().setDate(new Date().getDate() + 10)).toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})}.

If I do not receive my security deposit or a legally sufficient explanation for withholding it by this date, I will pursue all legal remedies available to me, including filing a claim in small claims court. Please be advised that many states permit tenants to seek double or triple damages plus court costs for wrongfully withheld security deposits.

I hope to resolve this matter amicably without the need for legal action.

Sincerely,

${details.tenantName}
${details.tenantAddress}`;
                } else {
                    // Generic letter for other types
                    fallbackContent = `${today}

${details.recipientName ? details.recipientName : details.borrowerName ? details.borrowerName : details.companyName ? details.companyName : details.contractorName ? details.contractorName : 'Recipient'}
${details.recipientAddress ? details.recipientAddress : details.borrowerAddress ? details.borrowerAddress : details.companyAddress ? details.companyAddress : details.contractorAddress ? details.contractorAddress : 'Recipient Address'}

RE: FORMAL DEMAND LETTER - ${letterType.toUpperCase().replace(/-/g, ' ')}

Dear ${details.recipientName ? details.recipientName : details.borrowerName ? details.borrowerName : details.companyName ? details.companyName : details.contractorName ? details.contractorName : 'Sir/Madam'},

I am writing this formal demand letter regarding the ${letterType.replace(/-/g, ' ')} matter between us. This letter serves as an official request to resolve this issue in a timely and satisfactory manner.

[Detailed description of the dispute would normally be here]

Please respond to this letter within 14 days of receipt, no later than ${new Date(new Date().setDate(new Date().getDate() + 14)).toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})}. If I do not receive a satisfactory response by this date, I will be forced to consider all legal options available to me, which may include seeking legal counsel and/or filing a claim in the appropriate court.

I trust that you will address this matter promptly so that we can resolve it amicably without the need for further legal action.

Sincerely,

${details.senderName ? details.senderName : details.lenderName ? details.lenderName : details.consumerName ? details.consumerName : details.ownerName ? details.ownerName : details.tenantName ? details.tenantName : 'Sender'}
${details.senderAddress ? details.senderAddress : details.lenderAddress ? details.lenderAddress : details.consumerAddress ? details.consumerAddress : details.ownerAddress ? details.ownerAddress : details.tenantAddress ? details.tenantAddress : 'Sender Address'}`;
                }
                
                return {
                    success: true,
                    content: fallbackContent,
                    metadata: {
                        model: 'template-fallback',
                        tokens: 0
                    }
                };
            }
        },
        
        // Fallback to template-based letter if AI fails
        generateTemplateLetterFallback: function(letterType, details, plan) {
            console.log('Fallback to template-based letter generation');
            
            // Generate a simple template-based letter as fallback
            const today = new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            const letterContent = `${today}

${details.recipientName || details.borrowerName || details.companyName || details.contractorName || details.landlordName || 'Recipient'}
${details.recipientAddress || details.borrowerAddress || details.companyAddress || details.contractorAddress || details.landlordAddress || 'Recipient Address'}

RE: FORMAL DEMAND - ${letterType.toUpperCase().replace(/-/g, ' ')}

Dear ${details.recipientName || details.borrowerName || details.companyName || details.contractorName || details.landlordName || 'Sir/Madam'},

This letter serves as a formal demand regarding the ${letterType.replace(/-/g, ' ')} dispute between us.

[Detailed description of the dispute and demands would be here]

Please respond by ${new Date(new Date().setDate(new Date().getDate() + 14)).toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})}.

Sincerely,

${details.senderName || details.lenderName || details.consumerName || details.ownerName || details.tenantName || 'Sender'}
${details.senderAddress || details.lenderAddress || details.consumerAddress || details.ownerAddress || details.tenantAddress || 'Sender Address'}`;
            
            // Format the letter based on plan
            const formattedLetter = this.formatLetter(letterContent, plan);
            
            return {
                success: true,
                letterContent: formattedLetter,
                letterTitle: this.getLetterTitle(letterType, details),
                generatedAt: new Date().toISOString(),
                wordDocumentUrl: this.getWordDocumentUrl(letterType, plan),
                aiGenerated: false
            };
        },
        
        // Format letter based on selected plan
        formatLetter: function(content, plan) {
            if (plan === 'professional' || plan === 'attorney') {
                // Add professional letterhead and formatting
                return `PROFESSIONAL LETTERHEAD
-----------------------------------

${content}

-----------------------------------
This letter was generated by DemandAI using Anthropic AI
`;
            }
            
            // Basic plain text format
            return content;
        },
        
        // Generate title for the letter
        getLetterTitle: function(letterType, details) {
            const titles = {
                'unpaid-invoice': `Demand Letter - Invoice #${details.invoiceNumber || ''}`,
                'security-deposit': `Security Deposit Return Demand - ${details.propertyAddress || ''}`,
                'defective-product': `Defective Product Demand - ${details.productName || ''}`,
                'contractor-dispute': `Contractor Dispute - ${details.projectDescription || ''}`,
                'personal-loan': `Loan Repayment Demand - $${details.amountOutstanding || ''}`,
                'other-dispute': `Demand Letter - ${details.disputeSubject || ''}`
            };
            
            return titles[letterType] || 'Demand Letter';
        },
        
        // Generate download link for Word document
        getWordDocumentUrl: function(letterType, plan) {
            // In a real implementation, this would generate a real Word document
            // For demo purposes, we'll return a dummy URL
            const id = Math.random().toString(36).substr(2, 9);
            return `/download/letter-${id}.docx`;
        }
    };
    
    // Function to connect to Anthropic AI API
    async function connectToAnthropic(letterType, details) {
        console.log('Connecting to Anthropic API to generate letter...');
        return await letterSystem.callAnthropicAPI(letterType, details);
    }
    
    // Application State
    let formData = {
        letterType: '',
        details: {},
        plan: '',
        customer: {},
        preview: null
    };
    
    // Add overlay to each letter type option for more reliable clicking
    document.querySelectorAll('.letter-type').forEach(element => {
        const overlay = document.createElement('div');
        overlay.className = 'letter-type-overlay';
        element.appendChild(overlay);
    });

    // Form generation functions for specific letter types - define these first
    function generateUnpaidInvoiceForm() {
        console.log('Generating unpaid invoice form');
        const dynamicFormFields = document.getElementById('dynamic-form-fields');
        dynamicFormFields.innerHTML += `
            <div class="form-row">
                <div class="field-group">
                    <label for="senderName">Your Name/Business Name</label>
                    <input type="text" id="senderName" required>
                </div>
                <div class="field-group">
                    <label for="senderAddress">Your Address</label>
                    <input type="text" id="senderAddress" required>
                </div>
            </div>
            <div class="form-row">
                <div class="field-group">
                    <label for="recipientName">Recipient Name/Business Name</label>
                    <input type="text" id="recipientName" required>
                </div>
                <div class="field-group">
                    <label for="recipientAddress">Recipient Address</label>
                    <input type="text" id="recipientAddress" required>
                </div>
            </div>
            <div class="form-row">
                <div class="field-group">
                    <label for="invoiceNumber">Invoice Number</label>
                    <input type="text" id="invoiceNumber" required>
                </div>
                <div class="field-group">
                    <label for="invoiceDate">Invoice Date</label>
                    <input type="date" id="invoiceDate" required>
                </div>
                <div class="field-group">
                    <label for="invoiceAmount">Invoice Amount ($)</label>
                    <input type="number" id="invoiceAmount" step="0.01" required>
                </div>
            </div>
            <div class="field-group">
                <label for="serviceDescription">Description of Services or Goods</label>
                <textarea id="serviceDescription" required></textarea>
            </div>
            <div class="form-row">
                <div class="field-group">
                    <label for="paymentDueDate">Payment Due Date</label>
                    <input type="date" id="paymentDueDate" required>
                </div>
                <div class="field-group">
                    <label for="paymentMethod">Preferred Payment Method</label>
                    <input type="text" id="paymentMethod" required>
                </div>
            </div>
            <div class="field-group">
                <label for="additionalInfo">Additional Information (Optional)</label>
                <textarea id="additionalInfo"></textarea>
            </div>
        `;
    }
    
    function generateSecurityDepositForm() {
        const dynamicFormFields = document.getElementById('dynamic-form-fields');
        dynamicFormFields.innerHTML += `
            <div class="form-row">
                <div class="field-group">
                    <label for="tenantName">Your Name</label>
                    <input type="text" id="tenantName" required>
                </div>
                <div class="field-group">
                    <label for="tenantAddress">Your Current Address</label>
                    <input type="text" id="tenantAddress" required>
                </div>
            </div>
            <div class="form-row">
                <div class="field-group">
                    <label for="landlordName">Landlord/Property Manager Name</label>
                    <input type="text" id="landlordName" required>
                </div>
                <div class="field-group">
                    <label for="landlordAddress">Landlord/Property Manager Address</label>
                    <input type="text" id="landlordAddress" required>
                </div>
            </div>
            <div class="form-row">
                <div class="field-group">
                    <label for="propertyAddress">Rental Property Address</label>
                    <input type="text" id="propertyAddress" required>
                </div>
            </div>
            <div class="form-row">
                <div class="field-group">
                    <label for="leaseStartDate">Lease Start Date</label>
                    <input type="date" id="leaseStartDate" required>
                </div>
                <div class="field-group">
                    <label for="leaseEndDate">Lease End Date/Move Out Date</label>
                    <input type="date" id="leaseEndDate" required>
                </div>
            </div>
            <div class="form-row">
                <div class="field-group">
                    <label for="depositAmount">Security Deposit Amount ($)</label>
                    <input type="number" id="depositAmount" step="0.01" required>
                </div>
                <div class="field-group">
                    <label for="depositDueDate">Date Deposit Return Due</label>
                    <input type="date" id="depositDueDate">
                </div>
            </div>
            <div class="field-group">
                <label for="reasonForWithholding">Landlord's Reason for Withholding (if any)</label>
                <textarea id="reasonForWithholding"></textarea>
            </div>
            <div class="field-group">
                <label for="disputeReason">Why You Dispute Any Withholdings</label>
                <textarea id="disputeReason" required></textarea>
            </div>
            <div class="field-group">
                <label for="additionalInfo">Additional Information (Optional)</label>
                <textarea id="additionalInfo"></textarea>
            </div>
        `;
    }
    
    function generateDefectiveProductForm() {
        const dynamicFormFields = document.getElementById('dynamic-form-fields');
        dynamicFormFields.innerHTML += `
            <div class="form-row">
                <div class="field-group">
                    <label for="consumerName">Your Name</label>
                    <input type="text" id="consumerName" required>
                </div>
                <div class="field-group">
                    <label for="consumerAddress">Your Address</label>
                    <input type="text" id="consumerAddress" required>
                </div>
            </div>
            <div class="form-row">
                <div class="field-group">
                    <label for="companyName">Company Name</label>
                    <input type="text" id="companyName" required>
                </div>
                <div class="field-group">
                    <label for="companyAddress">Company Address</label>
                    <input type="text" id="companyAddress" required>
                </div>
            </div>
            <div class="form-row">
                <div class="field-group">
                    <label for="productName">Product Name/Model</label>
                    <input type="text" id="productName" required>
                </div>
                <div class="field-group">
                    <label for="purchaseDate">Purchase Date</label>
                    <input type="date" id="purchaseDate" required>
                </div>
                <div class="field-group">
                    <label for="purchasePrice">Purchase Price ($)</label>
                    <input type="number" id="purchasePrice" step="0.01" required>
                </div>
            </div>
            <div class="field-group">
                <label for="defectDescription">Description of Defect/Problem</label>
                <textarea id="defectDescription" required></textarea>
            </div>
            <div class="field-group">
                <label for="attemptedResolution">Previous Attempts to Resolve</label>
                <textarea id="attemptedResolution" required></textarea>
            </div>
            <div class="field-group">
                <label for="requestedResolution">Requested Resolution (Refund, Replacement, Repair)</label>
                <select id="requestedResolution" required>
                    <option value="">Select Resolution</option>
                    <option value="Refund">Full Refund</option>
                    <option value="Replacement">Product Replacement</option>
                    <option value="Repair">Product Repair</option>
                    <option value="Other">Other (specify below)</option>
                </select>
            </div>
            <div class="field-group">
                <label for="additionalInfo">Additional Information (Optional)</label>
                <textarea id="additionalInfo"></textarea>
            </div>
        `;
    }
    
    function generateContractorDisputeForm() {
        const dynamicFormFields = document.getElementById('dynamic-form-fields');
        dynamicFormFields.innerHTML += `
            <div class="form-row">
                <div class="field-group">
                    <label for="ownerName">Your Name</label>
                    <input type="text" id="ownerName" required>
                </div>
                <div class="field-group">
                    <label for="ownerAddress">Your Address</label>
                    <input type="text" id="ownerAddress" required>
                </div>
            </div>
            <div class="form-row">
                <div class="field-group">
                    <label for="contractorName">Contractor Name/Company</label>
                    <input type="text" id="contractorName" required>
                </div>
                <div class="field-group">
                    <label for="contractorAddress">Contractor Address</label>
                    <input type="text" id="contractorAddress" required>
                </div>
            </div>
            <div class="form-row">
                <div class="field-group">
                    <label for="projectLocation">Project Location/Property Address</label>
                    <input type="text" id="projectLocation" required>
                </div>
            </div>
            <div class="form-row">
                <div class="field-group">
                    <label for="contractDate">Contract Date</label>
                    <input type="date" id="contractDate" required>
                </div>
                <div class="field-group">
                    <label for="contractAmount">Contract Amount ($)</label>
                    <input type="number" id="contractAmount" step="0.01" required>
                </div>
            </div>
            <div class="field-group">
                <label for="projectDescription">Description of Project/Services</label>
                <textarea id="projectDescription" required></textarea>
            </div>
            <div class="field-group">
                <label for="disputeDescription">Description of Dispute/Issue</label>
                <textarea id="disputeDescription" required></textarea>
            </div>
            <div class="field-group">
                <label for="amountInDispute">Amount in Dispute ($)</label>
                <input type="number" id="amountInDispute" step="0.01" required>
            </div>
            <div class="field-group">
                <label for="requestedResolution">Requested Resolution</label>
                <textarea id="requestedResolution" required></textarea>
            </div>
            <div class="field-group">
                <label for="additionalInfo">Additional Information (Optional)</label>
                <textarea id="additionalInfo"></textarea>
            </div>
        `;
    }
    
    function generatePersonalLoanForm() {
        const dynamicFormFields = document.getElementById('dynamic-form-fields');
        dynamicFormFields.innerHTML += `
            <div class="form-row">
                <div class="field-group">
                    <label for="lenderName">Your Name (Lender)</label>
                    <input type="text" id="lenderName" required>
                </div>
                <div class="field-group">
                    <label for="lenderAddress">Your Address</label>
                    <input type="text" id="lenderAddress" required>
                </div>
            </div>
            <div class="form-row">
                <div class="field-group">
                    <label for="borrowerName">Borrower's Name</label>
                    <input type="text" id="borrowerName" required>
                </div>
                <div class="field-group">
                    <label for="borrowerAddress">Borrower's Address</label>
                    <input type="text" id="borrowerAddress" required>
                </div>
            </div>
            <div class="form-row">
                <div class="field-group">
                    <label for="loanDate">Loan Date</label>
                    <input type="date" id="loanDate" required>
                </div>
                <div class="field-group">
                    <label for="loanAmount">Original Loan Amount ($)</label>
                    <input type="number" id="loanAmount" step="0.01" required>
                </div>
            </div>
            <div class="form-row">
                <div class="field-group">
                    <label for="amountRepaid">Amount Already Repaid ($)</label>
                    <input type="number" id="amountRepaid" step="0.01" required>
                </div>
                <div class="field-group">
                    <label for="amountOutstanding">Outstanding Amount ($)</label>
                    <input type="number" id="amountOutstanding" step="0.01" required>
                </div>
            </div>
            <div class="form-row">
                <div class="field-group">
                    <label for="dueDate">Original Due Date (if any)</label>
                    <input type="date" id="dueDate">
                </div>
                <div class="field-group">
                    <label for="interestRate">Interest Rate (% if applicable)</label>
                    <input type="number" id="interestRate" step="0.01">
                </div>
            </div>
            <div class="field-group">
                <label for="loanTerms">Loan Terms/Agreement Details</label>
                <textarea id="loanTerms" required></textarea>
            </div>
            <div class="field-group">
                <label for="repaymentRequest">Repayment Request Details</label>
                <textarea id="repaymentRequest" required></textarea>
            </div>
            <div class="field-group">
                <label for="additionalInfo">Additional Information (Optional)</label>
                <textarea id="additionalInfo"></textarea>
            </div>
        `;
    }
    
    function generateOtherDisputeForm() {
        const dynamicFormFields = document.getElementById('dynamic-form-fields');
        dynamicFormFields.innerHTML += `
            <div class="form-row">
                <div class="field-group">
                    <label for="senderName">Your Name</label>
                    <input type="text" id="senderName" required>
                </div>
                <div class="field-group">
                    <label for="senderAddress">Your Address</label>
                    <input type="text" id="senderAddress" required>
                </div>
            </div>
            <div class="form-row">
                <div class="field-group">
                    <label for="recipientName">Recipient Name</label>
                    <input type="text" id="recipientName" required>
                </div>
                <div class="field-group">
                    <label for="recipientAddress">Recipient Address</label>
                    <input type="text" id="recipientAddress" required>
                </div>
            </div>
            <div class="field-group">
                <label for="relationshipContext">Relationship/Context</label>
                <textarea id="relationshipContext" required></textarea>
            </div>
            <div class="field-group">
                <label for="disputeType">Type of Dispute</label>
                <input type="text" id="disputeType" required>
            </div>
            <div class="field-group">
                <label for="disputeDescription">Detailed Description of Dispute</label>
                <textarea id="disputeDescription" required></textarea>
            </div>
            <div class="field-group">
                <label for="relevantDates">Relevant Dates</label>
                <textarea id="relevantDates" required></textarea>
            </div>
            <div class="field-group">
                <label for="amountInDispute">Amount in Dispute ($ if applicable)</label>
                <input type="number" id="amountInDispute" step="0.01">
            </div>
            <div class="field-group">
                <label for="requestedResolution">Requested Resolution</label>
                <textarea id="requestedResolution" required></textarea>
            </div>
            <div class="field-group">
                <label for="additionalInfo">Additional Information (Optional)</label>
                <textarea id="additionalInfo"></textarea>
            </div>
        `;
    }
    
    function generateGenericForm() {
        const dynamicFormFields = document.getElementById('dynamic-form-fields');
        dynamicFormFields.innerHTML += `
            <div class="form-row">
                <div class="field-group">
                    <label for="senderName">Your Name</label>
                    <input type="text" id="senderName" required>
                </div>
                <div class="field-group">
                    <label for="senderAddress">Your Address</label>
                    <input type="text" id="senderAddress" required>
                </div>
            </div>
            <div class="form-row">
                <div class="field-group">
                    <label for="recipientName">Recipient Name</label>
                    <input type="text" id="recipientName" required>
                </div>
                <div class="field-group">
                    <label for="recipientAddress">Recipient Address</label>
                    <input type="text" id="recipientAddress" required>
                </div>
            </div>
            <div class="field-group">
                <label for="disputeSubject">Subject of Dispute</label>
                <input type="text" id="disputeSubject" required>
            </div>
            <div class="field-group">
                <label for="disputeDescription">Detailed Description</label>
                <textarea id="disputeDescription" required></textarea>
            </div>
            <div class="field-group">
                <label for="requestedAction">Requested Action</label>
                <textarea id="requestedAction" required></textarea>
            </div>
            <div class="field-group">
                <label for="timeframe">Requested Timeframe for Response</label>
                <input type="text" id="timeframe" required>
            </div>
            <div class="field-group">
                <label for="additionalInfo">Additional Information (Optional)</label>
                <textarea id="additionalInfo"></textarea>
            </div>
        `;
    }
    
    // Setup form functionality - direct DOM manipulation approach
    function setupFormFunctionality() {
        const formSteps = document.querySelectorAll('.form-step');
        const dynamicFormFields = document.getElementById('dynamic-form-fields');
        
        console.log('Setting up form functionality');
        
        // Update letter-type click handlers
        document.querySelectorAll('.letter-type, .letter-type-overlay').forEach(element => {
            element.addEventListener('click', function(e) {
                let type;
                
                // If clicked on overlay, get data-type from parent
                if (this.classList.contains('letter-type-overlay')) {
                    type = this.parentElement.getAttribute('data-type');
                } else {
                    type = this.getAttribute('data-type');
                }
                
                console.log('Letter type selected:', type);
                
                // Clear any existing selections
                document.querySelectorAll('.letter-type').forEach(el => {
                    el.classList.remove('selected');
                });
                
                // Select clicked type
                const targetElement = document.querySelector(`.letter-type[data-type="${type}"]`);
                if (targetElement) {
                    targetElement.classList.add('selected');
                }
                
                // Store letter type in form data
                formData.letterType = type;
                
                // Enable next button
                document.getElementById('step1-next').disabled = false;
            });
        });
        
        // Update payment plan click handlers
        document.querySelectorAll('.payment-plan').forEach(element => {
            element.addEventListener('click', function() {
                const plan = this.getAttribute('data-plan');
                
                // Clear any existing selections
                document.querySelectorAll('.payment-plan').forEach(el => {
                    el.classList.remove('selected');
                    
                    // Hide plan details 
                    const detailsId = el.getAttribute('data-plan') + '-details';
                    const detailsElement = document.getElementById(detailsId);
                    if (detailsElement) {
                        detailsElement.classList.remove('visible');
                    }
                });
                
                // Select clicked plan
                this.classList.add('selected');
                
                // Show details for selected plan
                const detailsElement = document.getElementById(plan + '-details');
                if (detailsElement) {
                    detailsElement.classList.add('visible');
                }
                
                // Store plan in form data
                formData.plan = plan;
                
                // Enable next button
                document.getElementById('step3-next').disabled = false;
            });
        });
        
        // Setup navigation buttons
        
        // Step 1 Next button
        const step1Next = document.getElementById('step1-next');
        if (step1Next) {
            step1Next.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Next button clicked, letterType:', formData.letterType);
                
                if (formData.letterType) {
                    // Generate form fields based on letter type
                    generateDynamicForm(formData.letterType);
                    
                    // Show step 2
                    showStep(1);
                } else {
                    alert('Please select a letter type to continue.');
                }
            });
        } else {
            console.error('Step 1 Next button not found in the DOM');
        }
        
        // Step 2 Back button
        const step2Back = document.getElementById('step2-back');
        if (step2Back) {
            step2Back.addEventListener('click', function(e) {
                e.preventDefault();
                showStep(0);
            });
        }
        
        // Step 2 Next button
        const step2Next = document.getElementById('step2-next');
        if (step2Next) {
            step2Next.addEventListener('click', async function(e) {
                e.preventDefault();
                
                // Collect form data
                collectFormData();
                
                // Validate form data
                if (validateFormData()) {
                    // Check address formatting
                    const addressFields = validateAddressFields();
                    if (!addressFields.valid) {
                        alert(`Please ensure all address fields include city, state, and zip code. Missing in: ${addressFields.missingIn.join(', ')}`);
                        return;
                    }
                    
                    // Ask for confirmation
                    if (!confirm("Are you sure all information is entered correctly? You won't be able to edit this letter after it's generated without paying again.")) {
                        return;
                    }
                    
                    // Show loading state
                    document.getElementById('letter-preview').textContent = "Generating your letter with Anthropic AI...";
                    showStep(2);
                    
                    try {
                        // Generate letter preview
                        const previewResult = await letterSystem.generateLetter(
                            formData.letterType,
                            formData.details,
                            'basic' // Always preview as basic format
                        );
                        
                        // Store preview
                        formData.preview = previewResult;
                        
                        // Display preview
                        document.getElementById('letter-preview').textContent = previewResult.letterContent;
                        
                        // Enable preview download
                        setupPreviewDownload(previewResult);
                    } catch (error) {
                        console.error('Error generating preview:', error);
                        document.getElementById('letter-preview').textContent = "An error occurred while generating your letter. Please try again.";
                    }
                } else {
                    alert('Please fill out all required fields.');
                }
            });
        }
        
        // Step 3 Back button
        const step3Back = document.getElementById('step3-back');
        if (step3Back) {
            step3Back.addEventListener('click', function(e) {
                e.preventDefault();
                showStep(1);
            });
        }
        
        // Step 3 Next button
        const step3Next = document.getElementById('step3-next');
        if (step3Next) {
            step3Next.addEventListener('click', function(e) {
                e.preventDefault();
                
                if (formData.plan) {
                    showStep(3);
                    initializeStripe();
                } else {
                    alert('Please select a plan to continue.');
                }
            });
        }
        
        // Step 4 Back button
        const step4Back = document.getElementById('step4-back');
        if (step4Back) {
            step4Back.addEventListener('click', function(e) {
                e.preventDefault();
                showStep(2);
            });
        }
        
        // Submit payment button
        const submitPaymentBtn = document.getElementById('submit-payment');
        if (submitPaymentBtn) {
            submitPaymentBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Collect customer data
                const emailInput = document.getElementById('email');
                const nameInput = document.getElementById('name');
                
                formData.customer.email = emailInput.value;
                formData.customer.name = nameInput.value;
                
                if (!emailInput.value || !nameInput.value) {
                    alert('Please fill out all required fields.');
                    return;
                }
                
                // Process payment (currently simulated)
                processPayment();
            });
        }
        
        // Navigation helper function
        function showStep(stepIndex) {
            console.log('Showing step', stepIndex);
            
            formSteps.forEach((step, index) => {
                if (index === stepIndex) {
                    step.classList.remove('hidden');
                    
                    // If showing preview, ensure content is populated
                    if (index === 2 && formData.preview) {
                        document.getElementById('letter-preview').textContent = formData.preview.letterContent;
                    }
                } else {
                    step.classList.add('hidden');
                }
            });
        }
        
        // Generate dynamic form based on letter type
        function generateDynamicForm(letterType) {
            console.log('Generating form for', letterType);
            
            if (!dynamicFormFields) {
                console.error('dynamicFormFields element not found');
                return;
            }
            
            // Clear previous content
            dynamicFormFields.innerHTML = '';
            
            // Add address format helper text
            const addressHelperDiv = document.createElement('div');
            addressHelperDiv.className = 'address-helper-text';
            addressHelperDiv.innerHTML = `
                <p class="helper-note">For all address fields, please use the following format:</p>
                <p class="helper-example">123 Main Street, Anytown, NY 12345</p>
                <p class="helper-note">Include street, city, state (2-letter code), and zip code.</p>
            `;
            dynamicFormFields.appendChild(addressHelperDiv);
            
            // Generate appropriate form
            switch(letterType) {
                case 'unpaid-invoice':
                    generateUnpaidInvoiceForm();
                    break;
                case 'security-deposit':
                    generateSecurityDepositForm();
                    break;
                case 'defective-product':
                    generateDefectiveProductForm();
                    break;
                case 'contractor-dispute':
                    generateContractorDisputeForm();
                    break;
                case 'personal-loan':
                    generatePersonalLoanForm();
                    break;
                case 'other-dispute':
                    generateOtherDisputeForm();
                    break;
                default:
                    generateGenericForm();
            }
        }
        
        // Setup preview download button
        function setupPreviewDownload(previewResult) {
            const previewDownloadBtn = document.getElementById('download-preview');
            if (previewDownloadBtn) {
                previewDownloadBtn.onclick = function(e) {
                    e.preventDefault();
                    
                    // Create a downloadable file
                    const blob = new Blob([previewResult.letterContent], {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = `DemandAI_${formData.letterType}_Preview.docx`;
                    
                    // Add to document, click, and clean up
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                    
                    return false;
                };
            }
        }
        
        // Helper function to collect form data
        function collectFormData() {
            // Reset details object
            formData.details = {};
            
            // Get all form input elements
            const inputElements = dynamicFormFields.querySelectorAll('input, textarea, select');
            
            // Process each input
            inputElements.forEach(element => {
                const field = element.getAttribute('id');
                formData.details[field] = element.value;
            });
        }
        
        // Helper function to validate form data
        function validateFormData() {
            // Check required fields
            const requiredInputs = dynamicFormFields.querySelectorAll('[required]');
            
            for (let input of requiredInputs) {
                if (!input.value) {
                    return false;
                }
            }
            
            return true;
        }
        
        // Helper function to validate address fields
        function validateAddressFields() {
            // Check address fields formatting
            const addressFieldIds = [
                'senderAddress', 'recipientAddress', 'landlordAddress', 'tenantAddress',
                'companyAddress', 'consumerAddress', 'contractorAddress', 'ownerAddress',
                'borrowerAddress', 'lenderAddress'
            ];
            
            const missingAddressElements = [];
            let addressesValid = true;
            
            // Check each potential address field that exists
            for (const fieldId of addressFieldIds) {
                const element = document.getElementById(fieldId);
                if (element && element.value) {
                    const addressText = element.value.toLowerCase();
                    
                    // Check for city, state, zip format
                    const hasCity = /[a-z]+ *,/.test(addressText);
                    const hasState = /[a-z]+ *, *[a-z]{2}/.test(addressText);
                    const hasZip = /\d{5}(-\d{4})?/.test(addressText);
                    
                    if (!(hasCity && hasState && hasZip)) {
                        addressesValid = false;
                        
                        // Get human-readable field name
                        const fieldName = fieldId
                            .replace(/([A-Z])/g, ' $1')
                            .toLowerCase()
                            .replace(/^./, str => str.toUpperCase());
                            
                        missingAddressElements.push(fieldName);
                    }
                }
            }
            
            return {
                valid: addressesValid,
                missingIn: missingAddressElements
            };
        }
    }
    
    // Stripe integration
    let stripe = Stripe('pk_test_51QybfoRHvofjGitYzk5HknQw69hNg55G7I91w42j9RPrPtnIVDGUVP64LHDVpDP6kcIPew385vdfXcmXsbQv8Nc900rNOCJGxy');
    let elements;
    let cardElement;
    const priceMap = {
        'basic': 2999,      // $29.99
        'professional': 4999,   // $49.99
        'attorney': 9999    // $99.99
    };
    
    // Initialize Stripe elements
    function initializeStripe() {
        // Set up Stripe elements
        elements = stripe.elements();
        
        // Create card element
        cardElement = elements.create('card', {
            style: {
                base: {
                    color: '#32325d',
                    fontFamily: '"Arial", Helvetica, sans-serif',
                    fontSmoothing: 'antialiased',
                    fontSize: '16px',
                    '::placeholder': {
                        color: '#aab7c4'
                    }
                },
                invalid: {
                    color: '#fa755a',
                    iconColor: '#fa755a'
                }
            }
        });
        
        // Mount card element
        cardElement.mount('#card-element');
        
        // Handle validation errors
        cardElement.on('change', function(event) {
            const displayError = document.getElementById('card-errors');
            if (event.error) {
                displayError.textContent = event.error.message;
            } else {
                displayError.textContent = '';
            }
        });
    }
    
    // Process payment (currently simulated)
    async function processPayment() {
        // Show loading state
        const submitButton = document.getElementById('submit-payment');
        submitButton.disabled = true;
        submitButton.textContent = 'Processing...';
        
        try {
            // For demo purposes - skip actual payment processing
            console.log('Demo mode: Skipping actual payment processing');
            
            // Generate order ID
            const orderId = 'ORD-' + Math.floor(Math.random() * 1000000);
            document.getElementById('order-id').textContent = orderId;
            
            try {
                // Generate letter with AI
                const letterResult = await letterSystem.generateLetter(
                    formData.letterType,
                    formData.details,
                    formData.plan
                );
                
                // Simulate email delivery
                const emailResult = letterSystem.sendEmail(
                    formData.customer.email,
                    `Your DemandAI ${formData.letterType.replace('-', ' ')} Letter`,
                    letterResult.letterContent,
                    formData.plan
                );
                
                // Create download button for all plans in test environment
                const thankYouContent = document.querySelector('#thank-you');
                
                // Create download section
                const downloadSection = document.createElement('div');
                downloadSection.className = 'download-section';
                downloadSection.innerHTML = `
                    <h4>Download Your Letter</h4>
                    <p>Your letter is ready to download in Word format.</p>
                    <a href="#" class="download-button" id="download-word">Download Word Document</a>
                `;
                
                thankYouContent.appendChild(downloadSection);
                
                // Make download button functional
                setTimeout(() => {
                    document.getElementById('download-word').addEventListener('click', function(e) {
                        e.preventDefault();
                        
                        // Create a Blob with the letter content
                        const blob = new Blob([letterResult.letterContent], {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
                        
                        // Create download link
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.style.display = 'none';
                        a.href = url;
                        a.download = `DemandAI_${formData.letterType}_Letter.docx`;
                        
                        // Append to body, click, and cleanup
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                    });
                }, 100);
                
                // For attorney review plans, show additional information
                if (formData.plan === 'attorney') {
                    const attorneyNote = document.createElement('div');
                    attorneyNote.className = 'attorney-note';
                    attorneyNote.innerHTML = `
                        <p><strong>Attorney Review Note:</strong> Your letter has been generated and will be reviewed by a licensed attorney within 1-2 business days.</p>
                        <p class="disclaimer">REMINDER: Attorney review does not constitute legal advice or establish an attorney-client relationship. 
                        The reviewing attorney will not be representing you in any legal matter and is only reviewing the document for professional formatting and content.</p>
                    `;
                    thankYouContent.appendChild(attorneyNote);
                } else {
                    // For basic and professional plans, customize message
                    const thankYouMessage = document.querySelector('#thank-you p:first-child');
                    thankYouMessage.textContent = `Your ${formData.letterType.replace('-', ' ')} demand letter has been generated and sent to your email address (${formData.customer.email}).`;
                }
                
                // Add satisfaction guarantee message
                const guaranteeNote = document.createElement('div');
                guaranteeNote.className = 'guarantee-note';
                guaranteeNote.innerHTML = `
                    <p><strong>Satisfaction Guarantee:</strong> If you're not completely satisfied with your letter, contact us within 24 hours at support@demandai.com for a full refund.</p>
                `;
                thankYouContent.appendChild(guaranteeNote);
                
                // Add Stripe secure badge
                const stripeNote = document.createElement('div');
                stripeNote.className = 'stripe-badge';
                stripeNote.innerHTML = `
                    <p>Payment processed securely by <img src="https://stripe.com/img/v3/home/twitter.png" alt="Stripe" height="20"></p>
                `;
                thankYouContent.appendChild(stripeNote);
                
                // For demo purposes, log success
                console.log(`Letter generated for ${formData.customer.name}`);
            } catch (error) {
                console.error('Error generating letter:', error);
                // Show generic success message even on error
                const thankYouContent = document.querySelector('#thank-you p:first-child');
                thankYouContent.textContent = 'Your demand letter has been processed. You will receive an email shortly.';
            }
            
            // Navigate to thank you step
            const formSteps = document.querySelectorAll('.form-step');
            formSteps.forEach((step, index) => {
                if (index === 4) { // Thank you step
                    step.classList.remove('hidden');
                } else {
                    step.classList.add('hidden');
                }
            });
            
            // Reset button state
            submitButton.disabled = false;
            submitButton.textContent = 'Complete Purchase';
            
        } catch (error) {
            console.error('Payment processing error:', error);
            const errorElement = document.getElementById('card-errors');
            errorElement.textContent = 'An unexpected error occurred. Please try again.';
            submitButton.disabled = false;
            submitButton.textContent = 'Complete Purchase';
        }
    }
    
    // Initialize the form when DOM is fully loaded
    setupFormFunctionality();
    
    // Log that initialization is complete
    console.log('Form setup complete - user can now interact with the form');
});
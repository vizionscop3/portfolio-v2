# VS Code Implementation Guide: AI Hallucination Reduction

## Prerequisites

- VS Code with GitHub Copilot extension installed
- Active GitHub Copilot subscription (free or paid)
- Access to Claude via GitHub Copilot or Claude Copilot extension

## Method 1: GitHub Copilot Custom Instructions (Recommended)

### Step 1: Create Instructions Directory

```bash
# In your project root
mkdir .github
```

### Step 2: Create Custom Instructions File

Create `.github/copilot-instructions.md`:

```markdown
---
applyTo: '**'
---

# AI Hallucination Reduction Instructions

## CORE VERIFICATION PROTOCOLS

- ALWAYS perform self-verification before responding
- Ask yourself "Am I certain about this information?" before each response
- Use qualifiers like "likely," "appears to be," "based on available information"
- State "I'm not certain" when unsure rather than guessing

## FACTUAL GROUNDING REQUIREMENTS

- Only reference information that can be verified
- Avoid speculation presented as fact
- Use step-by-step reasoning for complex topics
- Include confidence levels: [High/Medium/Low] for major claims

## RESPONSE STRUCTURE TEMPLATE
```

[Confidence Level: High/Medium/Low] [Verified Information Only] [Clear Uncertainty Markers Where Applicable] [No
Speculation as Fact]

```

## OVERLAP PREVENTION
- Track conversation history to avoid repetition
- Build upon previous responses rather than restating
- Reference earlier points explicitly: "As mentioned earlier..."
- Progress conversations forward with new information

## HALLUCINATION TRIGGERS TO AVOID
- Specific dates without verification
- Exact statistics without sources
- Detailed technical specifications beyond general knowledge
- Recent events beyond knowledge cutoff
- Personal information about individuals

## SAFE RESPONSE PATTERNS
- "Based on general principles..."
- "Typically, this type of system..."
- "Common approaches include..."
- "I'd need to verify specific details, but generally..."

## QUALITY GATES
Before each response:
1. Can I verify each factual claim?
2. Am I repeating previous information unnecessarily?
3. Am I presenting uncertainty as certainty?
4. Am I staying within verified knowledge bounds?

## EMERGENCY PROTOCOLS
- If unsure: Choose "I don't know" over guessing
- If complex: Break into verifiable components
- If recent: Acknowledge knowledge limitations
- If specific: Request verification or sources

Target: 90-95% accuracy (5-10% hallucination rate)
```

### Step 3: Enable Custom Instructions in VS Code

1. Open VS Code Settings (`Ctrl+,`)
2. Search for "copilot instructions"
3. Enable: `github.copilot.chat.codeGeneration.useInstructionFiles`
4. Optionally enable: `github.copilot.chat.testGeneration.useInstructionFiles`

### Step 4: Configure VS Code Settings

Add to your `settings.json`:

```json
{
  "github.copilot.chat.codeGeneration.useInstructionFiles": true,
  "github.copilot.chat.testGeneration.useInstructionFiles": true,
  "github.copilot.chat.instructionsFilesLocations": [".github/copilot-instructions.md"]
}
```

## Method 2: Claude Copilot Extension (Alternative)

### Step 1: Install Claude Copilot Extension

1. Open Extensions view (`Ctrl+Shift+X`)
2. Search for "Claude Copilot"
3. Install the extension by VictorNanka

### Step 2: Configure API Key

1. Get Anthropic API key from console.anthropic.com
2. Open Command Palette (`Ctrl+Shift+P`)
3. Run "Claude Copilot: Set API Key"
4. Enter your API key

### Step 3: Create System Prompt File

Create `.vscode/claude-system-prompt.md`:

```markdown
# System Instructions for AI Assistance

You are an AI assistant focused on providing accurate, verified information with minimal hallucinations.

## CORE PRINCIPLES

1. **Verification First**: Always verify information before stating it as fact
2. **Uncertainty Declaration**: Use "I'm not certain" when unsure
3. **No Speculation**: Never present assumptions as definitive facts
4. **Progressive Responses**: Build upon previous information, don't repeat

## BEFORE EACH RESPONSE:

- Ask: "Are you hallucinating right now?"
- Verify: Can I confirm this information?
- Assess: What's my confidence level (High/Medium/Low)?

## RESPONSE FORMAT:

[Confidence: High/Medium/Low] [Content with uncertainty markers] [Clear distinction between facts and speculation]

## AVOID:

- Specific dates without verification
- Exact statistics without sources
- Recent events beyond knowledge cutoff
- Detailed specs without confirmation

## TARGET: 90-95% accuracy, minimal overlap with previous responses
```

### Step 4: Configure Extension Settings

Add to `settings.json`:

```json
{
  "claude-copilot.systemPromptFile": ".vscode/claude-system-prompt.md",
  "claude-copilot.temperature": 0.3,
  "claude-copilot.enableStreamingResponse": true
}
```

## Method 3: Manual Prompt Engineering

### Step 1: Create Prompt Templates

Create `.vscode/ai-prompts.json`:

```json
{
  "hallucination_guard": {
    "prefix": "Before responding: Are you hallucinating? Verify facts. Use qualifiers.",
    "template": "[Confidence: {{confidence}}] {{response}} [Uncertainty markers: {{uncertainties}}]"
  },
  "overlap_prevention": {
    "prefix": "Check conversation history. Avoid repetition. Build upon previous responses.",
    "template": "Previous context: {{context}}. New information: {{new_info}}"
  }
}
```

### Step 2: Install Code Snippets Extension

1. Install "Code Snippets" extension
2. Configure custom snippets for hallucination checks

### Step 3: Create Keyboard Shortcuts

Add to `keybindings.json`:

```json
[
  {
    "key": "ctrl+alt+v",
    "command": "workbench.action.terminal.sendSequence",
    "args": {
      "text": "echo 'Verification Check: Are you certain about this information?'"
    }
  }
]
```

## Implementation Testing

### Step 1: Test Hallucination Detection

1. Ask Copilot for specific technical details
2. Verify it includes uncertainty markers
3. Check for confidence level indicators

### Step 2: Test Overlap Prevention

1. Have a multi-turn conversation
2. Verify responses build upon previous information
3. Check for unnecessary repetition

### Step 3: Validate Quality Gates

1. Test with ambiguous questions
2. Verify "I don't know" responses when appropriate
3. Check for step-by-step reasoning on complex topics

## Monitoring and Adjustment

### Daily Checks:

- Review AI responses for hallucination patterns
- Check for repetitive information
- Assess confidence level accuracy

### Weekly Reviews:

- Analyze conversation quality
- Update instruction files based on performance
- Adjust temperature settings if needed

### Success Metrics:

- 90-95% factual accuracy
- Minimal response overlap
- Clear uncertainty communication
- Progressive conversation development

## Troubleshooting

### Instructions Not Working:

1. Check file paths are correct
2. Restart VS Code
3. Verify extension settings
4. Check GitHub Copilot subscription status

### High Hallucination Rate:

1. Lower temperature settings
2. Add more specific constraints
3. Increase verification requirements
4. Switch to Claude model if available

### Response Overlap:

1. Strengthen conversation memory instructions
2. Add explicit non-repetition rules
3. Include context tracking requirements

---

_Implementation complete. Monitor performance and adjust instructions as needed._

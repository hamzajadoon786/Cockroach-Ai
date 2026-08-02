import { sendMistralRequest } from './mistralService';

export const AGENT_ROLES = {
  COORDINATOR: 'coordinator',
  CODE_SPECIALIST: 'code_specialist',
  LOGIC_ANALYST: 'logic_analyst',
  CREATIVE_WRITER: 'creative_writer'
};

export const INITIAL_AGENTS = [
  {
    id: 'coord-01',
    name: 'Swarm Coordinator',
    role: AGENT_ROLES.COORDINATOR,
    status: 'active',
    model: 'mistral-medium-latest',
    load: '12%',
    systemPrompt: 'You are the primary router and synthesizer for Cockroach AI. Determine task complexity and direct execution.'
  },
  {
    id: 'code-01',
    name: 'Dev Architect',
    role: AGENT_ROLES.CODE_SPECIALIST,
    status: 'active',
    model: 'mistral-large-latest',
    load: '35%',
    systemPrompt: 'You are a senior software architect. Provide clean, secure, production-ready code with no placeholders or pseudo-code.'
  },
  {
    id: 'logic-01',
    name: 'Logic Engine',
    role: AGENT_ROLES.LOGIC_ANALYST,
    status: 'active',
    model: 'open-mistral-7b',
    load: '0%',
    systemPrompt: 'You are an analytical specialist. Break down complex logic, algorithms, and technical debugging step-by-step.'
  },
  {
    id: 'creative-01',
    name: 'Content Synthesizer',
    role: AGENT_ROLES.CREATIVE_WRITER,
    status: 'active',
    model: 'mistral-small-latest',
    load: '5%',
    systemPrompt: 'You are a technical content specialist. Draft clear, engaging documentation and clear system explanations.'
  }
];

export class AgentOrchestrator {
  constructor(config = {}) {
    this.config = config;
    this.agents = INITIAL_AGENTS;
  }

  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }

  // Determine which agent should handle the incoming query
  classifyIntent(userInput) {
    const text = userInput.toLowerCase();
    
    if (text.includes('code') || text.includes('function') || text.includes('bug') || text.includes('api') || text.includes('import') || text.includes('react')) {
      return AGENT_ROLES.CODE_SPECIALIST;
    }
    if (text.includes('explain') || text.includes('why') || text.includes('compare') || text.includes('logic') || text.includes('algorithm')) {
      return AGENT_ROLES.LOGIC_ANALYST;
    }
    if (text.includes('write') || text.includes('draft') || text.includes('email') || text.includes('summary')) {
      return AGENT_ROLES.CREATIVE_WRITER;
    }

    return AGENT_ROLES.COORDINATOR;
  }

  // Execute request through targeted agent pipeline
  async processQuery(userInput, conversationHistory = [], onChunk = null) {
    const targetRole = this.classifyIntent(userInput);
    const assignedAgent = this.agents.find(a => a.role === targetRole) || this.agents[0];

    // Construct agent specific system prompt
    const systemInstruction = `${assignedAgent.systemPrompt}\n\nExecution Rules:\n1. Deliver complete, production-ready responses.\n2. Do not use placeholders or unfinished code snippets.\n3. Format clean markdown output.`;

    const messages = [
      { role: 'system', content: systemInstruction },
      ...conversationHistory,
      { role: 'user', content: userInput }
    ];

    try {
      const response = await sendMistralRequest({
        apiKey: this.config.mistralApiKey,
        model: assignedAgent.model || this.config.defaultModel || 'open-mistral-7b',
        temperature: this.config.temperature || 0.7,
        maxTokens: this.config.maxTokens || 2048,
        messages,
        onChunk
      });

      return {
        success: true,
        agent: assignedAgent,
        content: response.content,
        usage: response.usage
      };
    } catch (error) {
      console.error('Agent Orchestrator Error:', error);
      throw error;
    }
  }
}

export const orchestratorInstance = new AgentOrchestrator();

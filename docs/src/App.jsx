import React from 'react'

function App() {
    return (
        <div className="site">
            {/* Hero Section */}
            <header className="hero">
                <div className="hero-glow"></div>
                <div className="hero-content">
                    <div className="badge">Documentation Testing</div>
                    <h1 className="title">Doccident</h1>
                    <p className="tagline">
                        Test the code examples in your Markdown documentation.
                        <br />
                        <span className="highlight">Your README examples actually work.</span>
                    </p>
                    <div className="hero-actions">
                        <a href="https://www.npmjs.com/package/doccident" className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                            npm install --save-dev doccident
                        </a>
                        <a href="https://github.com/verifikasjon/doccident" className="btn btn-secondary" target="_blank" rel="noopener noreferrer">
                            View on GitHub
                        </a>
                    </div>
                </div>
            </header>

            {/* Problem Statement */}
            <section className="problem-section">
                <div className="container">
                    <h2 className="section-title">The Documentation Problem</h2>
                    <div className="problem-grid">
                        <div className="problem-card">
                            <div className="problem-icon-text">1</div>
                            <h3>Broken Examples</h3>
                            <p>Code examples stop working after refactoring<br/>Users encounter errors following your README</p>
                        </div>
                        <div className="problem-card">
                            <div className="problem-icon-text">2</div>
                            <h3>Outdated Output</h3>
                            <p>Output examples don't match actual behavior<br/>Documentation shows incorrect results</p>
                        </div>
                        <div className="problem-card">
                            <div className="problem-icon-text">3</div>
                            <h3>Manual Testing</h3>
                            <p>Copy-paste examples to verify they work<br/>Time-consuming and error-prone</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Before/After Demo */}
            <section className="demo-section">
                <div className="container">
                    <h2 className="section-title">See the Difference</h2>
                    <div className="demo-grid">
                        <div className="demo-card demo-before">
                            <div className="demo-label">Without Doccident</div>
                            <div className="demo-content">
                                <div className="terminal-demo">
                                    <div className="terminal-header">
                                        <span className="terminal-dot red"></span>
                                        <span className="terminal-dot yellow"></span>
                                        <span className="terminal-dot green"></span>
                                    </div>
                                    <div className="terminal-body">
                                        <div className="terminal-line">
                                            <span className="terminal-dim">$ </span>
                                            <span>User follows your README...</span>
                                        </div>
                                        <div className="terminal-line">
                                            <span className="terminal-error">Error: Cannot find module 'old-api'</span>
                                        </div>
                                        <div className="terminal-line">
                                            <span className="terminal-error">ReferenceError: getData is not defined</span>
                                        </div>
                                        <div className="terminal-line">
                                            <span className="terminal-dim">Examples broken after refactor 😞</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="demo-arrow">→</div>
                        <div className="demo-card demo-after">
                            <div className="demo-label">With Doccident</div>
                            <div className="demo-content">
                                <div className="terminal-demo">
                                    <div className="terminal-header">
                                        <span className="terminal-dot red"></span>
                                        <span className="terminal-dot yellow"></span>
                                        <span className="terminal-dot green"></span>
                                    </div>
                                    <div className="terminal-body">
                                        <div className="terminal-line">
                                            <span className="terminal-dim">$ </span>
                                            <span>npx doccident</span>
                                        </div>
                                        <div className="terminal-line">
                                            <span className="terminal-success">✓ README.md (5 examples)</span>
                                        </div>
                                        <div className="terminal-line">
                                            <span className="terminal-success">✓ docs/guide.md (12 examples)</span>
                                        </div>
                                        <div className="terminal-line">
                                            <span className="terminal-success">All examples pass! 🎉</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Languages */}
            <section className="languages-section">
                <div className="container">
                    <div className="languages-header">
                        <h2 className="section-title">14+ Languages Supported</h2>
                        <p className="section-subtitle">
                            Test code examples in your favorite languages. From JavaScript to COBOL, we've got you covered.
                        </p>
                    </div>
                    
                    <div className="languages-grid">
                        <div className="language-card">
                            <div className="language-icon">🟨</div>
                            <div className="language-name">JavaScript</div>
                        </div>
                        <div className="language-card">
                            <div className="language-icon">🔷</div>
                            <div className="language-name">TypeScript</div>
                        </div>
                        <div className="language-card">
                            <div className="language-icon">🐍</div>
                            <div className="language-name">Python</div>
                        </div>
                        <div className="language-card">
                            <div className="language-icon">🐹</div>
                            <div className="language-name">Go</div>
                        </div>
                        <div className="language-card">
                            <div className="language-icon">🦀</div>
                            <div className="language-name">Rust</div>
                        </div>
                        <div className="language-card">
                            <div className="language-icon">☕</div>
                            <div className="language-name">Java</div>
                        </div>
                        <div className="language-card">
                            <div className="language-icon">⚡</div>
                            <div className="language-name">C</div>
                        </div>
                        <div className="language-card">
                            <div className="language-icon">#️⃣</div>
                            <div className="language-name">C#</div>
                        </div>
                        <div className="language-card">
                            <div className="language-icon">📊</div>
                            <div className="language-name">R</div>
                        </div>
                        <div className="language-card">
                            <div className="language-icon">🐚</div>
                            <div className="language-name">Shell</div>
                        </div>
                        <div className="language-card">
                            <div className="language-icon">🔢</div>
                            <div className="language-name">Fortran</div>
                        </div>
                        <div className="language-card">
                            <div className="language-icon">💼</div>
                            <div className="language-name">COBOL</div>
                        </div>
                        <div className="language-card">
                            <div className="language-icon">🎮</div>
                            <div className="language-name">BASIC</div>
                        </div>
                        <div className="language-card">
                            <div className="language-icon">🐪</div>
                            <div className="language-name">Perl</div>
                        </div>
                        <div className="language-card">
                            <div className="language-icon">🔺</div>
                            <div className="language-name">Pascal</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Features */}
            <section className="features-section">
                <div className="container">
                    <h2 className="section-title">Key Features</h2>
                    <p className="section-subtitle">
                        Everything you need to keep your documentation examples accurate and working.
                    </p>
                    
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon-text">✓</div>
                            <h3>Automatic Execution</h3>
                            <p>Doccident extracts code blocks from your Markdown files and executes them in a sandboxed environment. No manual copy-paste required.</p>
                        </div>
                        
                        <div className="feature-card">
                            <div className="feature-icon-text">📊</div>
                            <h3>Output Verification</h3>
                            <p>Verify that your code produces the expected output. Use <code>{'<!-- output: id -->'}</code> to match stdout against your examples.</p>
                        </div>
                        
                        <div className="feature-card">
                            <div className="feature-icon-text">📸</div>
                            <h3>Snapshot Updates</h3>
                            <p>Run with <code>--update-output</code> to automatically update output blocks with actual results. Write code first, let Doccident fill in the output.</p>
                        </div>
                        
                        <div className="feature-card">
                            <div className="feature-icon-text">🔗</div>
                            <h3>Shared State</h3>
                            <p>Share variables and functions between code blocks with <code>{'<!-- share-code-between-examples -->'}</code>. Perfect for tutorials.</p>
                        </div>
                        
                        <div className="feature-card">
                            <div className="feature-icon-text">⚙️</div>
                            <h3>Flexible Configuration</h3>
                            <p>Configure test environment with <code>.doccident-setup.js</code>. Inject dependencies, set globals, transform code before execution.</p>
                        </div>
                        
                        <div className="feature-card">
                            <div className="feature-icon-text">🎯</div>
                            <h3>Precise Errors</h3>
                            <p>When tests fail, Doccident maps errors back to the exact line in your Markdown file. No guessing where the problem is.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Output Verification Demo */}
            <section className="demo-section">
                <div className="container">
                    <h2 className="section-title">Output Verification</h2>
                    <p className="section-subtitle">
                        Ensure your documentation's output examples match reality.
                    </p>
                    
                    <div className="code-block">
                        <div className="code-line"><span className="code-comment">{'// In your README.md'}</span></div>
                        <div className="code-line"></div>
                        <div className="code-line"><span className="code-comment">{'<!-- id: hello-world -->'}</span></div>
                        <div className="code-line">```js</div>
                        <div className="code-line">console.log("Hello, Doccident!");</div>
                        <div className="code-line">```</div>
                        <div className="code-line"></div>
                        <div className="code-line"><span className="code-comment">{'<!-- output: hello-world -->'}</span></div>
                        <div className="code-line">```text</div>
                        <div className="code-line">Hello, Doccident!</div>
                        <div className="code-line">```</div>
                    </div>
                    
                    <div className="terminal-demo">
                        <div className="terminal-header">
                            <span className="terminal-dot red"></span>
                            <span className="terminal-dot yellow"></span>
                            <span className="terminal-dot green"></span>
                            <span className="terminal-title">npx doccident README.md</span>
                        </div>
                        <div className="terminal-body">
                            <div className="terminal-line">
                                <span className="terminal-success">✓ Code executes successfully</span>
                            </div>
                            <div className="terminal-line">
                                <span className="terminal-success">✓ Output matches expected result</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Snapshot Updates */}
            <section className="features-section">
                <div className="container">
                    <h2 className="section-title">Automatic Snapshot Updates</h2>
                    <p className="section-subtitle">
                        Write your code examples, run with <code>--update-output</code>, and Doccident fills in the output for you.
                    </p>
                    
                    <div className="code-block">
                        <div className="code-line"><span className="code-comment"># Update all output blocks with actual results</span></div>
                        <div className="code-line">npx doccident --update-output</div>
                        <div className="code-line"></div>
                        <div className="code-line"><span className="code-comment"># Great for:</span></div>
                        <div className="code-line"><span className="code-comment"># - Writing new documentation</span></div>
                        <div className="code-line"><span className="code-comment"># - Updating after API changes</span></div>
                        <div className="code-line"><span className="code-comment"># - Keeping output examples current</span></div>
                    </div>
                </div>
            </section>

            {/* Configuration */}
            <section className="demo-section">
                <div className="container">
                    <h2 className="section-title">Configuration</h2>
                    <p className="section-subtitle">
                        Create a <code>.doccident-setup.js</code> file to configure your test environment.
                    </p>
                    
                    <div className="code-block">
                        <div className="code-line"><span className="code-comment">// .doccident-setup.js</span></div>
                        <div className="code-line">module.exports = {`{`}</div>
                        <div className="code-line">  <span className="code-comment">// Make libraries available to examples</span></div>
                        <div className="code-line">  require: {`{`}</div>
                        <div className="code-line">    'my-library': require('./index.js'),</div>
                        <div className="code-line">    'lodash': require('lodash')</div>
                        <div className="code-line">  {`}`},</div>
                        <div className="code-line"></div>
                        <div className="code-line">  <span className="code-comment">// Define global variables</span></div>
                        <div className="code-line">  globals: {`{`}</div>
                        <div className="code-line">    API_KEY: 'test-key',</div>
                        <div className="code-line">    DEBUG: true</div>
                        <div className="code-line">  {`}`},</div>
                        <div className="code-line"></div>
                        <div className="code-line">  <span className="code-comment">// Run before each test</span></div>
                        <div className="code-line">  beforeEach: () => {`{`}</div>
                        <div className="code-line">    <span className="code-comment">// Reset state, clear mocks, etc.</span></div>
                        <div className="code-line">  {`}`}</div>
                        <div className="code-line">{`}`};</div>
                    </div>
                </div>
            </section>

            {/* CI Integration */}
            <section className="features-section">
                <div className="container">
                    <h2 className="section-title">CI Integration</h2>
                    <p className="section-subtitle">
                        Run Doccident in your CI pipeline to catch broken examples before they reach users.
                    </p>
                    
                    <div className="code-block">
                        <div className="code-line"><span className="code-comment"># GitHub Actions</span></div>
                        <div className="code-line">- name: Test Documentation Examples</div>
                        <div className="code-line">  run: npx doccident</div>
                        <div className="code-line"></div>
                        <div className="code-line"><span className="code-comment"># Add to package.json scripts</span></div>
                        <div className="code-line">"scripts": {`{`}</div>
                        <div className="code-line">  "test": "vitest && doccident",</div>
                        <div className="code-line">  "test:docs": "doccident"</div>
                        <div className="code-line">{`}`}</div>
                    </div>
                </div>
            </section>

            {/* Quick Start */}
            <section className="quickstart-section">
                <div className="container">
                    <h2 className="section-title">Get Started in 30 Seconds</h2>
                    
                    <div className="quickstart-steps">
                        <div className="step">
                            <div className="step-number">1</div>
                            <div className="step-content">
                                <h4>Install</h4>
                                <code>npm install --save-dev doccident</code>
                            </div>
                        </div>
                        <div className="step">
                            <div className="step-number">2</div>
                            <div className="step-content">
                                <h4>Run</h4>
                                <code>npx doccident</code>
                            </div>
                        </div>
                        <div className="step">
                            <div className="step-number">3</div>
                            <div className="step-content">
                                <h4>Done</h4>
                                <code>All examples tested! ✓</code>
                            </div>
                        </div>
                    </div>
                    
                    <div className="code-block" style={{maxWidth: '600px', margin: '3rem auto'}}>
                        <div className="code-line"><span className="code-comment"># Test all markdown files</span></div>
                        <div className="code-line">npx doccident</div>
                        <div className="code-line"></div>
                        <div className="code-line"><span className="code-comment"># Test specific files</span></div>
                        <div className="code-line">npx doccident README.md docs/**/*.md</div>
                        <div className="code-line"></div>
                        <div className="code-line"><span className="code-comment"># Update output examples</span></div>
                        <div className="code-line">npx doccident --update-output</div>
                        <div className="code-line"></div>
                        <div className="code-line"><span className="code-comment"># Custom timeout (milliseconds)</span></div>
                        <div className="code-line">npx doccident --timeout 60000</div>
                    </div>
                </div>
            </section>

            {/* Real-World Example */}
            <section className="demo-section">
                <div className="container">
                    <h2 className="section-title">Real-World Example</h2>
                    <p className="section-subtitle">
                        This is how Doccident itself uses... Doccident. Meta, right?
                    </p>
                    
                    <div className="terminal-demo">
                        <div className="terminal-header">
                            <span className="terminal-dot red"></span>
                            <span className="terminal-dot yellow"></span>
                            <span className="terminal-dot green"></span>
                            <span className="terminal-title">npx doccident README.md</span>
                        </div>
                        <div className="terminal-body">
                            <div className="terminal-line">
                                <span className="terminal-dim">Testing examples in README.md...</span>
                            </div>
                            <div className="terminal-line">
                                <span className="terminal-success">✓ JavaScript example (line 107)</span>
                            </div>
                            <div className="terminal-line">
                                <span className="terminal-success">✓ TypeScript example (line 125)</span>
                            </div>
                            <div className="terminal-line">
                                <span className="terminal-success">✓ Python example (line 153)</span>
                            </div>
                            <div className="terminal-line">
                                <span className="terminal-success">✓ Shell example (line 175)</span>
                            </div>
                            <div className="terminal-line">
                                <span className="terminal-success">✓ C example (line 308)</span>
                            </div>
                            <div className="terminal-line"></div>
                            <div className="terminal-line">
                                <span className="terminal-success">All 37 examples passed! 🎉</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section">
                <div className="container">
                    <h2>Stop Shipping Broken Examples</h2>
                    <p>Ensure your documentation examples actually work—every single time.</p>
                    <div className="cta-buttons">
                        <a href="https://www.npmjs.com/package/doccident" className="btn btn-primary btn-large" target="_blank" rel="noopener noreferrer">
                            Install from NPM
                        </a>
                        <a href="https://github.com/verifikasjon/doccident" className="btn btn-secondary btn-large" target="_blank" rel="noopener noreferrer">
                            View on GitHub
                        </a>
                    </div>
                </div>
            </section>

            <footer className="footer">
                <div className="container">
                    <p>Apache 2.0 License | Built with ❤️ for better documentation</p>
                </div>
            </footer>
        </div>
    )
}

export default App

// render.js - Main Render Function

function render() {
    const container = document.getElementById('mainContent');
    if (!container) return;
    
    const html = `
        <div class="card">
            <h2 style="margin-bottom: 16px;">Daily Check-In</h2>
            
            <div style="background: #f0f9ff; border: 2px solid #3b82f6; border-radius: 8px; padding: 16px;">
                ${state.saveError ? '<div id="saveError" style="background: #fee2e2; color: #991b1b; padding: 8px 12px; border-radius: 4px; margin-bottom: 12px; font-size: 13px; border: 1px solid #fecaca;">' + state.saveError + '</div>' : ''}
                
                <!-- Question -->
                <div style="margin-bottom: 12px;">
                    <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 18px;">How are you feeling today?</label>
                </div>
                
                <!-- Topic Label and Life Area -->
                <div style="margin-bottom: 12px; display: flex; gap: 8px; align-items: flex-end;">
                    <div style="flex: 0 0 35%;">
                        <label style="display: block; font-weight: 600; margin-bottom: 4px; font-size: 12px;">Topic Label</label>
                        <input type="text" value="${state.topicLabel}" oninput="state.topicLabel = this.value;" placeholder="e.g., Morning check-in" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px;">
                    </div>
                    <div style="flex: 1; display: flex; gap: 6px; align-items: center;">
                        <select onchange="loadLifeArea(this.value)" style="flex: 1; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px; background: white;">
                            <option value="">Select Life Area (Optional)</option>
                            ${Object.keys(state.lifeAreas).filter(key => state.lifeAreas[key].visible).map(areaKey => {
                                const area = state.lifeAreas[areaKey];
                                const isActive = state.activeLifeArea === areaKey;
                                return '<option value="' + areaKey + '" ' + (isActive ? 'selected' : '') + '>' + area.label + '</option>';
                            }).join('')}
                        </select>
                    </div>
                </div>
                
                <!-- Hijacking Event -->
                <div style="margin-bottom: 16px;">
                    <label style="display: block; font-weight: 600; margin-bottom: 4px; font-size: 12px;">Hijacking Event?</label>
                    <select onchange="state.hijackingEvent = this.value; render();" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px; background: white;">
                        <option value="" ${!state.hijackingEvent ? 'selected' : ''}>Not specified</option>
                        <option value="yes" ${state.hijackingEvent === 'yes' ? 'selected' : ''}>Yes</option>
                        <option value="maybe" ${state.hijackingEvent === 'maybe' ? 'selected' : ''}>Maybe</option>
                        <option value="no" ${state.hijackingEvent === 'no' ? 'selected' : ''}>No</option>
                    </select>
                </div>
                
                <!-- Percentage Sliders -->
                <div style="border-top: 1px solid #e5e7eb; padding-top: 12px;">
                    <p style="font-size: 13px; color: #6b7280; margin-bottom: 12px;">Adjust sliders to reflect your current state (total = 100%)</p>
                    
                    <!-- Stressor -->
                    <div class="slider-group">
                        <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 4px;">
                            <div style="color: #f44336; white-space: nowrap; font-size: 14px; font-weight: 600; min-width: 100px;">⚠️ Stress</div>
                            <div style="color: #f44336; font-weight: bold; min-width: 40px; text-align: center; font-size: 18px;">${state.stressorPercent}%</div>
                            <div style="flex: 1;">
                                <input type="range" min="${MIN_PERCENT}" max="${MAX_PERCENT}" value="${state.stressorPercent}" oninput="updatePercent('stressor', this.value)" style="width: 100%; height: 8px; border-radius: 4px; outline: none; -webkit-appearance: none; cursor: pointer; background: linear-gradient(to right, #f44336 0%, #ff6b6b 100%);">
                            </div>
                        </div>
                        <textarea placeholder="Notes: What's causing stress?" oninput="updateNotes('stressor', this.value)" style="width: 100%; padding: 6px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 13px; font-family: inherit; min-height: 40px; resize: vertical;">${state.stressorNotes}</textarea>
                    </div>
                    
                    <!-- Stabilizer -->
                    <div class="slider-group">
                        <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 4px;">
                            <div style="color: #1976d2; white-space: nowrap; font-size: 14px; font-weight: 600; min-width: 100px;">🛡️ Regulated</div>
                            <div style="color: #1976d2; font-weight: bold; min-width: 40px; text-align: center; font-size: 18px;">${state.stabilizerPercent}%</div>
                            <div style="flex: 1;">
                                <input type="range" min="${MIN_PERCENT}" max="${MAX_PERCENT}" value="${state.stabilizerPercent}" oninput="updatePercent('stabilizer', this.value)" style="width: 100%; height: 8px; border-radius: 4px; outline: none; -webkit-appearance: none; cursor: pointer; background: linear-gradient(to right, #1976d2 0%, #42a5f5 100%);">
                            </div>
                        </div>
                        <textarea placeholder="Notes: What's helping you feel stable?" oninput="updateNotes('stabilizer', this.value)" style="width: 100%; padding: 6px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 13px; font-family: inherit; min-height: 40px; resize: vertical;">${state.stabilizerNotes}</textarea>
                    </div>
                    
                    <!-- Opportunity -->
                    <div class="slider-group">
                        <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 4px;">
                            <div style="color: #4caf50; white-space: nowrap; font-size: 14px; font-weight: 600; min-width: 100px;">💚 Opportunity</div>
                            <div style="color: #4caf50; font-weight: bold; min-width: 40px; text-align: center; font-size: 18px;">${state.opportunityPercent}%</div>
                            <div style="flex: 1;">
                                <input type="range" min="${MIN_PERCENT}" max="${MAX_PERCENT}" value="${state.opportunityPercent}" oninput="updatePercent('opportunity', this.value)" style="width: 100%; height: 8px; border-radius: 4px; outline: none; -webkit-appearance: none; cursor: pointer; background: linear-gradient(to right, #4caf50 0%, #81c784 100%);">
                            </div>
                        </div>
                        <textarea placeholder="Notes: What opportunities do you see?" oninput="updateNotes('opportunity', this.value)" style="width: 100%; padding: 6px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 13px; font-family: inherit; min-height: 40px; resize: vertical;">${state.opportunityNotes}</textarea>
                    </div>
                </div>
                
                <!-- Buttons -->
                <div style="margin-top: 16px; display: flex; gap: 8px;">
                    <button onclick="saveCheckIn()" class="btn" style="flex: 1; padding: 12px; background: #16a34a; color: white; font-size: 16px; font-weight: 600;">💾 Save Check-In</button>
                    <button onclick="resetForm(); render(); updateVisualization();" class="btn" style="flex: 1; padding: 12px; background: #6b7280; color: white; font-size: 16px; font-weight: 600;">🔄 Clear</button>
                </div>
            </div>
        </div>
        
        <!-- Visualization -->
        <div class="card">
            <h2 style="margin-bottom: 12px;">Window of Tolerance Visualization</h2>
            <div class="visualization" id="visualization"></div>
        </div>
    `;
    
    container.innerHTML = html;
    updateVisualization();
}

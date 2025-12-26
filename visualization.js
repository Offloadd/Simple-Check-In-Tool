// visualization.js - Window of Tolerance Visualization

function updateVisualization() {
    const vizDiv = document.getElementById('visualization');
    if (!vizDiv) return;
    
    const height = 300;
    
    // Calculate heights based on percentages
    const stressHeight = (state.stressorPercent / 100) * height;
    const regulatedHeight = (state.stabilizerPercent / 100) * height;
    const opportunityHeight = (state.opportunityPercent / 100) * height;
    
    // Dynamic stress gradient: low stress = yellow/orange, high stress = dark red
    // At 10% -> yellowish, at 50% -> orange-red, at 80% -> dark red
    const stressGradient = state.stressorPercent <= 30 
        ? 'linear-gradient(to bottom, #FFA500 0%, #FF8C00 50%, #FF6347 100%)' // Low stress: orange tones
        : state.stressorPercent <= 50
        ? 'linear-gradient(to bottom, #FF6347 0%, #DC143C 50%, #CD5C5C 100%)' // Medium stress: red
        : 'linear-gradient(to bottom, #8B0000 0%, #DC143C 50%, #CD5C5C 100%)'; // High stress: dark red
    
    // Blue zone stays blue
    const regulatedGradient = 'linear-gradient(to bottom, #87CEEB 0%, #4682B4 50%, #1E90FF 100%)';
    
    // Dynamic opportunity gradient: low = green, high = yellow-green
    // At 10-40% -> green, at 40-65% -> lime green, at 65%+ -> yellow-green
    const opportunityGradient = state.opportunityPercent <= 40
        ? 'linear-gradient(to top, #006400 0%, #228B22 50%, #32CD32 100%)' // Low opportunity: dark to bright green
        : state.opportunityPercent <= 65
        ? 'linear-gradient(to top, #228B22 0%, #32CD32 50%, #7FFF00 100%)' // Medium opportunity: bright green to lime
        : 'linear-gradient(to top, #32CD32 0%, #9ACD32 50%, #ADFF2F 100%)'; // High opportunity: lime to yellow-green
    
    vizDiv.innerHTML = `
        <div class="color-legend">
            <div style="padding: 8px 4px; color: black; font-size: 8px; font-weight: bold; line-height: 1.3; text-align: center; z-index: 12; display: flex; flex-direction: column; justify-content: space-evenly; height: 100%;">
                <div>Hopelessness<br>Powerlessness<br>Overwhelmed<br>Anger/Resentful<br>Easily Agitated</div>
                <div style="margin-top: 15px;">Drivenness<br>Worry/Anxiety<br>Hypervigilance<br>On Edge<br>Fear of Failure</div>
                <div style="margin-top: 15px;">Rest is Forced<br>Deeper Sleep<br>Grounded<br>Calm/Regulated<br>Recovering</div>
                <div style="margin-top: 15px;">Flexibility<br>Joy/Enthusiasm<br>Expansiveness<br>Opportunity<br>Freedom</div>
            </div>
        </div>
        
        <!-- Stress zone (top) -->
        <div style="position: absolute; top: 0; left: 0; right: 0; height: ${stressHeight}px; background: ${stressGradient}; border-radius: 8px 8px 0 0; transition: all 0.3s ease;"></div>
        
        <!-- Regulated zone (middle) -->
        <div style="position: absolute; top: ${stressHeight}px; left: 0; right: 0; height: ${regulatedHeight}px; background: ${regulatedGradient}; transition: all 0.3s ease;"></div>
        
        <!-- Opportunity zone (bottom) -->
        <div style="position: absolute; bottom: 0; left: 0; right: 0; height: ${opportunityHeight}px; background: ${opportunityGradient}; border-radius: 0 0 8px 8px; transition: all 0.3s ease;"></div>
        
        <!-- Percentage labels -->
        <div style="position: absolute; top: ${stressHeight / 2}px; right: 10px; color: white; font-weight: bold; font-size: 18px; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); transform: translateY(-50%);">
            Stress - ${state.stressorPercent}%
        </div>
        
        <div style="position: absolute; top: ${stressHeight + regulatedHeight / 2}px; right: 10px; color: white; font-weight: bold; font-size: 18px; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); transform: translateY(-50%);">
            Regulated Processing<br>Capacity - ${state.stabilizerPercent}%
        </div>
        
        <div style="position: absolute; bottom: ${opportunityHeight / 2}px; right: 10px; color: white; font-weight: bold; font-size: 18px; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); transform: translateY(50%);">
            Opportunity - ${state.opportunityPercent}%
        </div>
    `;
}

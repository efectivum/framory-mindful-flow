import React from 'react';
import { MobileCard } from '@/components/ui/MobileCard';
import { MobileButton } from '@/components/ui/MobileButton';
import { MobileHeader } from '@/components/ui/MobileHeader';
import { MobilePage, MobileContent } from '@/components/layouts/MobileLayout';

/**
 * Demo component showcasing the mobile-first design system
 * This component demonstrates proper usage of:
 * - Mobile-first layout components
 * - Semantic design tokens from CSS custom properties
 * - Touch-optimized interaction patterns
 * - Responsive typography system
 */
export const MobileFirstDemo: React.FC = () => {
  return (
    <div className="mobile-page">
      <MobileHeader 
        title="Mobile-First Demo" 
        showBack={false}
        actions={
          <MobileButton variant="primary" size="small">
            Actions
          </MobileButton>
        }
      />
      
      <div className="mobile-content mobile-flow">
        <div className="mobile-section">
          <h2 className="mobile-h2">Design System Components</h2>
          <p className="mobile-body text-muted-foreground">
            All components use semantic design tokens and mobile-first responsive patterns.
          </p>
        </div>

        <div className="mobile-section">
          <h3 className="mobile-h3 mb-4">Interactive Cards</h3>
          <div className="mobile-grid-2 gap-4">
            <MobileCard variant="default" interactive>
              <h4 className="mobile-h4">Default Card</h4>
              <p className="mobile-caption text-muted-foreground">Touch optimized with haptic feedback</p>
            </MobileCard>
            
            <MobileCard variant="flat" interactive>
              <h4 className="mobile-h4">Flat Card</h4>
              <p className="mobile-caption text-muted-foreground">Minimal style variant</p>
            </MobileCard>
          </div>
        </div>

        <div className="mobile-section">
          <h3 className="mobile-h3 mb-4">Button Variants</h3>
          <div className="mobile-stack gap-3">
            <MobileButton variant="primary" fullWidth>
              Primary Button
            </MobileButton>
            
            <MobileButton variant="secondary" fullWidth>
              Secondary Button
            </MobileButton>
            
            <MobileButton variant="outline" fullWidth>
              Outline Button
            </MobileButton>
            
            <MobileButton variant="ghost" fullWidth>
              Ghost Button
            </MobileButton>
          </div>
        </div>

        <div className="mobile-section">
          <h3 className="mobile-h3 mb-4">Typography Scale</h3>
          <div className="mobile-stack">
            <div className="mobile-display text-primary">Display Text</div>
            <h1 className="mobile-h1">Heading 1</h1>
            <h2 className="mobile-h2">Heading 2</h2>
            <h3 className="mobile-h3">Heading 3</h3>
            <p className="mobile-body">Body text with proper line height and spacing for mobile readability.</p>
            <p className="mobile-caption text-muted-foreground">Caption text for secondary information.</p>
            <p className="mobile-detail text-muted-foreground">Detail text for fine print and metadata.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
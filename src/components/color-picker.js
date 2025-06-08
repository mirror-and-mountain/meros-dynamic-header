import { useSelect } from '@wordpress/data';
import {
    ColorPalette,
    Button,
    Dropdown,
    BaseControl,
    ColorIndicator
} from '@wordpress/components';

export function OverlayColorPicker({ attribute, label, currentColor, setAttributes }) {
    const themeColors = useSelect((select) =>
        select('core/block-editor').getSettings().colors || []
    , []);

    return (
        <div className="meros-color-picker">
            <Dropdown
                renderToggle={({ onToggle }) => (
                    <Button
                        onClick={onToggle}
                        variant="secondary"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            width: '100%',
                        }}
                    >
                        <ColorIndicator colorValue={currentColor} />
                        {label}
                    </Button>
                )}
                renderContent={() => (
                    <div style={{ padding: '10px' }}>
                        <BaseControl label={label}>
                            <ColorPalette
                                colors={themeColors}
                                value={currentColor}
                                onChange={(color) => {
                                    setAttributes({
                                        [attribute]: color,
                                    });
                                }}
                                disableCustomColors={false}
                                enableAlpha={true}
                            />
                        </BaseControl>
                    </div>
                )}
            />
        </div>
    );
}

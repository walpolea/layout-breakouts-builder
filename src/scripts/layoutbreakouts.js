
export class LayoutBreakout {

  minimumContentPadding;
  tracks;
  defaultTrackName;

  constructor(minimumContentPadding, tracks, defaultTrackName = "content") {
    this.minimumContentPadding = minimumContentPadding;
    this.defaultTrackName = defaultTrackName;
    this.tracks = tracks.map( (t,i) => {
      return new BreakoutTrack(t.trackName, t.maxWidth, i === 0 ? BreakoutTrack.OUTERMOST : i === tracks.length - 1 ? BreakoutTrack.INNERMOST : BreakoutTrack.MIDDLE);
    });
  }

  generateCSS() {
    return `

.page-layout > :where(*), .full-width > :where(*) {
  grid-column: ${this.defaultTrackName};
}
.page-layout, .full-width {
--minimum-content-padding: ${this.minimumContentPadding};

/** TRACK WIDTHS **/
${this.tracks.map(t => t.generateMaxWidth()).join("\n")}

/** TRACK SIZES **/
${this.tracks.map( (t,i) => t.generateTrackSize(this.tracks[i+1])).join("\n")}

display: grid;
grid-template-columns: 
${this.generateTracks( this.tracks )};
}

/** CLASSES **/
${this.tracks.map(t => t.generateClasses()).join("\n")}

.full-width { grid-column: full; }
`;

  }

  generateTracks( tracks, spaceCount = 1 ) {

    if( !tracks.length ) {
      return '';
    }

    const s = getSpaces(spaceCount);
    const n = `\n`;

    const currentTrack = tracks.slice( 0, 1 )[0];
    const remainingTracks = tracks.slice( 1 );

    const cssStart = `${s}[${currentTrack.trackName}-start]${n}`;
    const cssMiddle1st = `${s}var(--${currentTrack.trackName})${n}`;
    const cssInnerTracks = this.generateTracks( remainingTracks, spaceCount + 1 );
    const cssMiddle2nd = currentTrack.trackType !== BreakoutTrack.INNERMOST ? `${s}var(--${currentTrack.trackName})${n}` : '';
    const cssEnd = `${s}[${currentTrack.trackName}-end]`;
    const endLine = spaceCount !== 1 ? `${n}` : '';

    return `${cssStart}${cssMiddle1st}${cssInnerTracks}${cssMiddle2nd}${cssEnd}${endLine}`;
  }

}

export class BreakoutTrack {

  static MIDDLE = "MIDDLE";
  static OUTERMOST = "OUTERMOST";
  static INNERMOST = "INNERMOST";

  trackName;
  maxWidth;
  trackType;

  constructor(trackName, maxWidth = "1fr", trackType = "MIDDLE") {
    this.trackName = trackName;
    this.maxWidth = maxWidth;
    this.trackType = trackType;
  }

  generateTrackSize( childTrack ) {
    switch (this.trackType) {
      case BreakoutTrack.MIDDLE:
        return `--${this.trackName}: minmax( 0, calc( ( var(--${this.trackName}-max-width) - var(--${childTrack?.trackName}-max-width)) * 0.5 ) );`;
      case BreakoutTrack.OUTERMOST:
        return `--${this.trackName}: minmax( var(--minimum-content-padding), 1fr );`;
      case BreakoutTrack.INNERMOST:
        return `--${this.trackName}: min( var(--${this.trackName}-max-width), 100% - var(--minimum-content-padding) * 2 );`;
    }
  }


  generateClasses() {

    return `.${this.trackName} { grid-column: ${this.trackName}; }
.${this.trackName}-start { grid-column-start: ${this.trackName}-start; }
.${this.trackName}-end { grid-column-end: ${this.trackName}-end; }
`;
  }

  generateMaxWidth() {
    return `--${this.trackName}-max-width: ${this.maxWidth};`;
  }


}


function getSpaces(spaceCount) {
  return spaceCount ? '  '.repeat(spaceCount) : '';
}
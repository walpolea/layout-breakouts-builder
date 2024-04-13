
export class LayoutBreakout {

  minimumContentPadding;
  tracks;

  constructor(minimumContentPadding, tracks) {
    this.minimumContentPadding = minimumContentPadding;
    this.tracks = tracks.map( (t,i) => {
      return new BreakoutTrack(t.trackName, t.maxWidth, i === 0 ? BreakoutTrack.OUTERMOST : i === tracks.length - 1 ? BreakoutTrack.INNERMOST : BreakoutTrack.MIDDLE);
    });
  }

  generateCSS( defaultTrackName = "content") {
    return `

.page-layout > :where(*), .full-width > :where(*) {
  grid-column: ${defaultTrackName};
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

  generateTracks( tracks ) {

    if( !tracks.length ) {
      return '';
    }

    const currentTrack = tracks.slice( 0, 1 )[0];
    const remainingTracks = tracks.slice( 1 );

    const cssStart = `[${currentTrack.trackName}-start]`;
    const cssMiddle = `var(--${currentTrack.trackName})`;
    const cssInnerTracks = this.generateTracks( remainingTracks );
    const cssEnd = `[${currentTrack.trackName}-end]`;

    return `${cssStart}
${cssMiddle}
${cssInnerTracks}
${currentTrack.trackType !== BreakoutTrack.INNERMOST ? cssMiddle : ''}
${cssEnd}`;
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
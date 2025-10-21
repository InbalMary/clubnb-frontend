export function AppHeaderSkeleton({ isCompact, isIndexPage, isHostPage, isTripsPage, isSticky }) {
	const headerClass = isCompact
		? `compact-header full ${!isSticky ? 'no-sticky main-content' : ''} ${isIndexPage ? 'index-page' : ''}`
		: `app-header full ${isIndexPage ? 'index-page' : ''}`

	const containerClass = isCompact ? 'compact-header-content' : 'nav-bar'

	return (
		<header className={`${headerClass} skeleton-header`}>
			<div className={containerClass}>
				{/* Logo skeleton */}
				<div className="logo-header">
					<div className="skeleton skeleton-logo"></div>
				</div>

				{/* Host navigation skeleton- hosting */}
				{isCompact && isHostPage && (
					<nav className="host-navigation">
						<div className="skeleton skeleton-nav-item"></div>
						<div className="skeleton skeleton-nav-item"></div>
					</nav>
				)}

				{/* Search bar skeleton -(no host and no trips) */}
				{isCompact && !isHostPage && !isTripsPage && (
					<div className="compact-search-button skeleton-search-compact">
						<div className="skeleton skeleton-search-text"></div>
						<div className="skeleton skeleton-search-divider"></div>
						<div className="skeleton skeleton-search-text"></div>
						<div className="skeleton skeleton-search-divider"></div>
						<div className="skeleton skeleton-search-text"></div>
						<div className="skeleton skeleton-search-icon"></div>
					</div>
				)}

				{/* Actions skeleton */}
				<div className="header-actions">
					<div className="skeleton skeleton-link"></div>
					<div className="skeleton skeleton-circle"></div>
					<div className="skeleton skeleton-circle"></div>
				</div>
			</div>

			{/* Expanded search area skeleton- home page*/}
			{!isCompact && (
				<div className="expanded-header-search">
					<div className="skeleton skeleton-expanded-search"></div>
				</div>
			)}
		</header>
	)
}